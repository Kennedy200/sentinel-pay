import requests
import os
import json
import pandas as pd
import joblib
import shutil
import uuid  # ADDED THIS IMPORT TO FIX THE 500 ERROR
from datetime import datetime
from django.conf import settings
from django.db.models import Count
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer, 
    UserSerializer, 
    ChangePasswordSerializer
)
from .models import (
    BehavioralProfile, 
    Transaction, 
    FraudAnalysis, 
    HistoricalTransaction, 
    Notification,
    APIKey
)
from .parser import extract_dna_from_file 
from .trainer import train_user_models 

User = get_user_model()

# --- 1. AUTHENTICATION VIEWS ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create initial notification
        Notification.objects.create(
            user=user,
            title="Welcome to Sentinel-Pay",
            message="Your account is active. Please upload history to enable AI protection.",
            notif_type='system'
        )
        
        return Response({
            "message": "User created successfully. Sentinel-Pay profile initialized.",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        google_user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        response = requests.get(google_user_info_url, headers={'Authorization': f'Bearer {token}'})

        if response.status_code != 200:
            return Response({'error': 'Invalid Google Token'}, status=status.HTTP_400_BAD_REQUEST)

        user_data = response.json()
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['email'],
                'first_name': user_data.get('given_name', ''),
                'last_name': user_data.get('family_name', ''),
            }
        )

        BehavioralProfile.objects.get_or_create(user=user)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


# --- 2. DNA & AI TRAINING VIEWS ---

class DNAUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp_uploads')
        os.makedirs(temp_dir, exist_ok=True)
        path = os.path.join(temp_dir, file_obj.name)
        
        with open(path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        try:
            # 1. Extract patterns and save to HistoricalTransaction table
            dna_data = extract_dna_from_file(path, request.user)

            if dna_data:
                profile, _ = BehavioralProfile.objects.get_or_create(user=request.user)
                profile.avg_transaction_amount = dna_data['avg_amount']
                profile.max_transaction_amount = dna_data['max_amount']
                profile.typical_active_hours = dna_data['active_hours']
                profile.is_profile_active = True
                profile.save()

                # 2. TRIGGER AI TRAINING
                training_success = train_user_models(request.user)

                Notification.objects.create(
                    user=request.user,
                    title="DNA Profile Built",
                    message="AI models have been trained on your history. Behavioral DNA protection is now active.",
                    notif_type='system'
                )

                if os.path.exists(path): os.remove(path)

                return Response({
                    "status": "success",
                    "dna_stats": dna_data,
                    "ai_trained": training_success
                }, status=status.HTTP_200_OK)
            
            return Response({"error": "Failed to parse history."}, status=400)

        except Exception as e:
            if os.path.exists(path): os.remove(path)
            return Response({"error": str(e)}, status=500)

class ResetProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            model_dir = os.path.join(settings.MEDIA_ROOT, 'models', str(user.id))
            if os.path.exists(model_dir):
                shutil.rmtree(model_dir)

            HistoricalTransaction.objects.filter(user=user).delete()
            Transaction.objects.filter(user=user).delete()
            Notification.objects.filter(user=user).delete()

            profile = user.behavioral_profile
            profile.avg_transaction_amount = 0
            profile.max_transaction_amount = 0
            profile.typical_active_hours = []
            profile.is_profile_active = False
            profile.save()

            return Response({"message": "Behavioral DNA wiped. AI is now idle."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# --- 3. MASTER ANALYSIS & SIMULATOR ---

class TransactionAnalyzeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data, user = request.data, request.user
        amount = float(data.get('amount', 0))
        current_hour = datetime.now().hour
        cat = data.get('category', 'transfer')
        
        merchant_risk_score = 0.9 if cat in ['crypto', 'betting', 'intl'] else 0.1

        global_model_path = os.path.join(settings.BASE_DIR, 'global_models', 'global_xgb.joblib')
        local_dir = os.path.join(settings.MEDIA_ROOT, 'models', str(user.id))
        local_iso_path = os.path.join(local_dir, 'iso_model.joblib')

        if not os.path.exists(global_model_path):
            return Response({"error": "Global AI Knowledge Base not found."}, status=500)

        try:
            input_df = pd.DataFrame([[amount, current_hour, merchant_risk_score]], columns=['amount', 'hour', 'merchant_risk'])
            global_model = joblib.load(global_model_path)
            global_prob = global_model.predict_proba(input_df)[0][1]

            if os.path.exists(local_iso_path):
                iso_model = joblib.load(local_iso_path)
                local_pred = iso_model.predict(input_df[['amount', 'hour']])[0]
                local_score = 0.7 if local_pred == -1 else 0.1
            else:
                local_score = 0.5

            base_ai_score = (global_prob * 0.5) + (local_score * 0.5)
        except Exception as e:
            return Response({"error": f"AI Logic Failure: {str(e)}"}, status=500)

        explanations = []
        rule_penalty = 0.0
        profile = user.behavioral_profile
        avg_hist = float(profile.avg_transaction_amount)

        if amount > (avg_hist * 10):
            rule_penalty += 0.45
            explanations.append({"feature": "Limit", "impact": "CRITICAL", "reason": f"Extreme Spike: ₦{amount:,.0f} is 10x your average. Fraud signature detected."})
        elif amount > (avg_hist * 3):
            rule_penalty += 0.15
            explanations.append({"feature": "Limit", "impact": "HIGH", "reason": f"Unusual Spike: High deviation from your historical profile."})
        else:
            explanations.append({"feature": "Limit", "impact": "SAFE", "reason": "Amount aligns with your behavioral DNA."})

        if current_hour not in profile.typical_active_hours:
            rule_penalty += 0.2
            explanations.append({"feature": "Time", "impact": "HIGH", "reason": f"Clock Anomaly: Request at {current_hour}:00 is an outlier."})
        else:
            explanations.append({"feature": "Time", "impact": "SAFE", "reason": "Standard active window matches history."})

        final_fraud_score = min(base_ai_score + rule_penalty, 1.0)
        status_action = 'blocked' if final_fraud_score >= 0.80 else 'flagged' if final_fraud_score >= 0.40 else 'approved'

        # Log Data
        txn = Transaction.objects.create(user=user, amount=amount, merchant=data.get('recipient','Transfer'), status=status_action)
        FraudAnalysis.objects.create(transaction=txn, fraud_score=final_fraud_score, risk_level='high' if status_action=='blocked' else 'low', shap_explanations=explanations)

        # CREATE NOTIFICATION IF RISK IS HIGH
        if status_action in ['blocked', 'flagged']:
            Notification.objects.create(
                user=user,
                title=f"Security Alert: {status_action.capitalize()}",
                message=f"A transaction of ₦{amount:,.0f} to {txn.merchant} was {status_action} by the Ensemble Engine.",
                notif_type='fraud'
            )

        return Response({
            "transaction_id": txn.id,
            "status": status_action,
            "fraud_score": round(final_fraud_score, 2),
            "shap_explanations": explanations
        })

class VerifyTransactionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        txn_id = request.data.get('transaction_id')
        try:
            txn = Transaction.objects.get(id=txn_id, user=request.user)
            txn.status = 'approved'
            txn.save()
            HistoricalTransaction.objects.create(user=request.user, amount=txn.amount, description=f"Manually Authorized")
            train_user_models(request.user)
            Notification.objects.create(user=request.user, title="AI Intelligence Updated", message="Pattern marked as safe for your profile.", notif_type='system')
            return Response({"status": "success"})
        except:
            return Response({"error": "Txn not found"}, status=404)


# --- 4. PUBLIC API GATEWAY ---

class PublicAnalyzeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # 1. Authenticate via Key
        key_header = request.headers.get('X-Sentinel-Key')
        if not key_header:
            return Response({"error": "No API Key provided"}, status=401)
        
        try:
            api_key_obj = APIKey.objects.get(key=key_header)
            user = api_key_obj.user
        except APIKey.DoesNotExist:
            return Response({"error": "Invalid API Key"}, status=401)

        # 2. RUN AI MODELS
        data = request.data
        amount = float(data.get('amount', 0))
        current_hour = int(data.get('hour', datetime.now().hour))
        cat = data.get('category', 'transfer')
        merchant_risk = 0.9 if cat in ['crypto', 'betting'] else 0.1

        g_path = os.path.join(settings.BASE_DIR, 'global_models', 'global_xgb.joblib')
        l_path = os.path.join(settings.MEDIA_ROOT, 'models', str(user.id), 'iso_model.joblib')

        try:
            input_df = pd.DataFrame([[amount, current_hour, merchant_risk]], columns=['amount', 'hour', 'merchant_risk'])
            global_prob = joblib.load(g_path).predict_proba(input_df)[0][1]
            
            if os.path.exists(l_path):
                local_pred = joblib.load(l_path).predict(input_df[['amount', 'hour']])[0]
                local_score = 0.7 if local_pred == -1 else 0.1
            else:
                local_score = 0.5
            
            final_score = (global_prob * 0.5) + (local_score * 0.5)
            status_action = 'blocked' if final_score > 0.7 else 'flagged' if final_score > 0.4 else 'approved'
            
            return Response({
                "status": status_action,
                "fraud_probability": round(final_score * 100, 1),
                "analyzed_by": "Sentinel Triple-Ensemble Engine",
                "request_id": str(uuid.uuid4())[:8],
                "owner": user.email
            })
        except Exception as e:
            return Response({"error": f"Internal AI Failure: {str(e)}"}, status=500)


# --- 5. LOGS & STATS VIEWS ---

class RiskLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-timestamp')
        log_data = []
        for txn in transactions:
            try:
                analysis = txn.ai_analysis
                log_data.append({
                    "id": str(txn.id),
                    "timestamp": txn.timestamp,
                    "amount": float(txn.amount),
                    "merchant": txn.merchant,
                    "status": txn.status,
                    "fraud_score": round(analysis.fraud_score * 100, 1),
                    "explanations": analysis.shap_explanations
                })
            except: continue
        return Response(log_data)

class DNAStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            profile = request.user.behavioral_profile
            hour_data = [{"hour": f"{h:02d}:00", "value": 100 if h in profile.typical_active_hours else 20} for h in range(24)]
            category_counts = HistoricalTransaction.objects.filter(user=request.user).values('category').annotate(value=Count('category')).order_by('-value')
            merchant_data = [{"name": item['category'] if item['category'] else "Others", "value": item['value']} for item in category_counts]
            
            return Response({
                "avg_amount": float(profile.avg_transaction_amount),
                "max_amount": float(profile.max_transaction_amount),
                "active_hours": hour_data,
                "merchants": merchant_data if merchant_data else [{"name": "No Data", "value": 100}],
                "is_active": profile.is_profile_active,
                "last_updated": profile.last_updated
            })
        except: return Response({"error": "No profile"}, status=404)

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        try:
            profile = user.behavioral_profile
            history_count = HistoricalTransaction.objects.filter(user=user).count()
            dna_strength = min(int((history_count / 50) * 100), 100) if history_count > 0 else 0
            blocked = Transaction.objects.filter(user=user, status='blocked').count()
            recent = Transaction.objects.filter(user=user).order_by('-timestamp')[:3]
            
            return Response({
                "is_active": profile.is_profile_active,
                "dna_strength": dna_strength,
                "total_simulations": Transaction.objects.filter(user=user).count(),
                "threats_blocked": blocked,
                "recent_activity": [{"id": str(t.id)[:8], "merchant": t.merchant, "amount": float(t.amount), "status": t.status} for t in recent],
                "user_name": f"{user.first_name} {user.last_name}" if user.first_name else f"{user.email.split('@')[0]}",
                "avatar": user.avatar.url if user.avatar else None
            })
        except: return Response({"error": "Dashboard failed"}, status=500)


# --- 6. USER PROFILE, KEYS & NOTIFICATIONS ---

class APIKeyView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        keys = APIKey.objects.filter(user=request.user)
        return Response([{"id": k.id, "name": k.name, "key": k.key, "created": k.created_at} for k in keys])
    def post(self, request):
        name = request.data.get('name', 'Production Key')
        new_key = APIKey.generate_key(request.user, name)
        return Response({"key": new_key.key, "name": new_key.name, "created": new_key.created_at})

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self): return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.check_password(serializer.data.get("old_password")):
                return Response({"error": "Wrong password"}, status=400)
            request.user.set_password(serializer.data.get("new_password"))
            request.user.save()
            return Response({"message": "Success"})
        return Response(serializer.errors, status=400)

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        notifs = Notification.objects.filter(user=request.user).order_by('-created_at')[:15]
        return Response([{
            "id": n.id, "title": n.title, "message": n.message, "type": n.notif_type, "is_read": n.is_read, "time": n.created_at
        } for n in notifs])

    def post(self, request):
        Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({"status": "read"})
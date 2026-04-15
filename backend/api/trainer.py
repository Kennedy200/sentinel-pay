import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
import joblib
import os
from django.conf import settings
from .models import HistoricalTransaction, BehavioralProfile

def train_user_models(user):
    try:
        history = HistoricalTransaction.objects.filter(user=user)
        if history.count() < 3: return False

        amounts = [float(t.amount) for t in history]
        # Use a mix of hours to show the model that "Legit" happens at various times
        hours = [10, 12, 14, 16] * (len(amounts) // 4 + 1)
        hours = hours[:len(amounts)]
        
        real_data = pd.DataFrame({'amount': amounts, 'hour': hours})
        real_data['label'] = 0 
        
        # GENERATE AGGRESSIVE FRAUD DATA
        # We need to show the model that high amounts = 1 (Fraud)
        avg_val = sum(amounts) / len(amounts)
        max_val = max(amounts)
        
        fraud_data = pd.DataFrame({
            'amount': [max_val * 5, max_val * 10, max_val * 50, avg_val * 20],
            'hour': [3, 4, 2, 11], # Include a daytime fraud to show amount matters!
            'label': [1, 1, 1, 1] 
        })

        df = pd.concat([real_data, fraud_data], ignore_index=True)
        X = df[['amount', 'hour']]
        y = df['label']

        # Train with 'scale_pos_weight' to make Fraud more important
        rf_model = RandomForestClassifier(n_estimators=100, class_weight='balanced')
        rf_model.fit(X, y)

        xgb_model = XGBClassifier(scale_pos_weight=10) # Heavy weight on fraud
        xgb_model.fit(X, y)

        model_dir = os.path.join(settings.MEDIA_ROOT, 'models', str(user.id))
        os.makedirs(model_dir, exist_ok=True)
        joblib.dump(rf_model, os.path.join(model_dir, 'rf_model.joblib'))
        joblib.dump(xgb_model, os.path.join(model_dir, 'xgb_model.joblib'))
        
        return True
    except Exception as e:
        print(f"TRAINING ERROR: {e}")
        return False
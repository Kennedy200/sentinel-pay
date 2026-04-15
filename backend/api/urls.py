from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, GoogleLoginView, DNAUploadView, 
    TransactionAnalyzeView, RiskLogsView, DNAStatsView, 
    DashboardSummaryView, UserProfileView, ChangePasswordView,
    ResetProfileView, NotificationListView, VerifyTransactionView, 
    APIKeyView, PublicAnalyzeView
)

urlpatterns = [
    # Identity
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Intelligence
    path('dna/upload/', DNAUploadView.as_view(), name='dna_upload'),
    path('dna/stats/', DNAStatsView.as_view(), name='dna_stats'),
    path('dna/reset/', ResetProfileView.as_view(), name='dna_reset'),
    
    # Monitoring
    path('analyze/', TransactionAnalyzeView.as_view(), name='analyze'),
    path('verify-transaction/', VerifyTransactionView.as_view(), name='verify_txn'),
    path('logs/', RiskLogsView.as_view(), name='risk_logs'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    
    # User Profile
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    
    # Developer Hub & Public API
    path('dev/keys/', APIKeyView.as_view(), name='api_keys'),
    path('public/analyze/', PublicAnalyzeView.as_view(), name='public_analyze'),
]
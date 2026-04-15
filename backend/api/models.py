import uuid, secrets
from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Custom User Model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

# 2. Behavioral DNA Profile 
class BehavioralProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='behavioral_profile')
    avg_transaction_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    max_transaction_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    typical_active_hours = models.JSONField(default=list)
    top_merchants = models.JSONField(default=list)
    usual_locations = models.JSONField(default=list)
    last_updated = models.DateTimeField(auto_now=True)
    is_profile_active = models.BooleanField(default=False)

    def __str__(self):
        return f"DNA Profile - {self.user.email}"

# 3. Historical Data Point
class HistoricalTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='historical_data')
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    timestamp = models.DateTimeField(null=True, blank=True)
    description = models.CharField(max_length=500, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    extracted_at = models.DateTimeField(auto_now_add=True)

# 4. Simulation Logs
class Transaction(models.Model):
    STATUS_CHOICES = (('pending', 'Pending'), ('approved', 'Approved'), ('flagged', 'Flagged'), ('blocked', 'Blocked'))
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    merchant = models.CharField(max_length=255)
    merchant_category = models.CharField(max_length=100, default='transfer')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

# 5. AI Analysis Result
class FraudAnalysis(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='ai_analysis')
    fraud_score = models.FloatField()
    risk_level = models.CharField(max_length=10)
    shap_explanations = models.JSONField(default=dict)
    analyzed_at = models.DateTimeField(auto_now_add=True)

# 6. Notifications
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notif_type = models.CharField(max_length=20, default='system')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# 7. API Keys for Developers
class APIKey(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    key = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=50, default="Production Key")
    created_at = models.DateTimeField(auto_now_add=True)
    
    @classmethod
    def generate_key(cls, user, name="Production Key"):
        prefix = "sp_live_"
        random_str = secrets.token_urlsafe(32)
        return cls.objects.create(user=user, key=f"{prefix}{random_str}", name=name)
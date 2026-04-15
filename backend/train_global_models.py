import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_main_intelligence():
    if not os.path.exists('global_fraud_data.csv'):
        print("❌ Error: global_fraud_data.csv not found. Run generate_base_data.py first.")
        return

    print("📊 Loading 500,000 records into memory...")
    df = pd.read_csv('global_fraud_data.csv')
    
    X = df[['amount', 'hour', 'merchant_risk']]
    y = df['label']

    # Split into 80% Training and 20% Testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("🧠 Training XGBoost Model (High Performance)...")
    xgb = XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    xgb.fit(X_train, y_train)

    print("🌲 Training Random Forest Model (Robustness)...")
    rf = RandomForestClassifier(n_estimators=50, max_depth=10, n_jobs=-1)
    rf.fit(X_train, y_train)

    # EVALUATION
    predictions = xgb.predict(X_test)
    acc = accuracy_score(y_test, predictions)
    
    print("\n" + "="*40)
    print(f"SENTINEL-PAY AI PERFORMANCE REPORT")
    print(f"Overall Accuracy: {acc * 100:.2f}%")
    print("="*40)
    print(classification_report(y_test, predictions))
    print("="*40)

    # Save models
    os.makedirs('global_models', exist_ok=True)
    joblib.dump(rf, 'global_models/global_rf.joblib')
    joblib.dump(xgb, 'global_models/global_xgb.joblib')
    
    print("\n📂 Global Brains saved successfully in /global_models/")

if __name__ == "__main__":
    train_main_intelligence()
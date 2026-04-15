import pandas as pd
import numpy as np
import random

def generate_global_dataset():
    print("🚀 Generating Sentinel-Pay Big Data: 500,000 Transactions...")
    data = []

    # 1. Generate Legitimate Transactions (approx. 70%)
    # Patterns: Low-mid amounts, Daytime, Low-risk merchants
    for _ in range(350000):
        amount = random.uniform(200, 35000) 
        hour = random.randint(8, 21) # 8 AM to 9 PM
        merchant_risk = random.uniform(0.0, 0.3) # Low risk
        data.append([amount, hour, merchant_risk, 0])

    # 2. Generate Midway / Suspicious Transactions (approx. 15%)
    # Patterns: Medium-high amounts, transition hours, medium-risk merchants
    for _ in range(75000):
        amount = random.uniform(40000, 150000)
        hour = random.choice([6, 7, 22, 23]) # Early morning or late night
        merchant_risk = random.uniform(0.4, 0.6)
        data.append([amount, hour, merchant_risk, 0]) # Still legit, but "on the edge"

    # 3. Generate Hard Fraud Transactions (approx. 15%)
    # Patterns: Extreme amounts, Midnight, High-risk merchants (Crypto/Betting)
    for _ in range(75000):
        # Type A: Midnight Drain
        amount = random.uniform(200000, 5000000) 
        hour = random.randint(0, 5) # 12 AM to 5 AM
        merchant_risk = random.uniform(0.7, 1.0)
        data.append([amount, hour, merchant_risk, 1])

    df = pd.DataFrame(data, columns=['amount', 'hour', 'merchant_risk', 'label'])
    
    # Shuffle the data so the model doesn't learn based on order
    df = df.sample(frac=1).reset_index(drop=True)
    
    df.to_csv('global_fraud_data.csv', index=False)
    print(f"✅ Success: 'global_fraud_data.csv' created with {len(df)} rows.")

if __name__ == "__main__":
    generate_global_dataset()
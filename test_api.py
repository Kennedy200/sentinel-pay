import requests
import json

# 1. YOUR DATA
URL = "http://127.0.0.1:8000/api/v1/public/analyze/"
API_KEY = "sp_live_EE_FMy7TnCuFtzpmhevg-BSkss7TYLAhrt8kGwBna8w"

# 2. THE TEST TRANSACTION (Suspicious ₦1 Million at 3 AM)
payload = {
    "amount": 1000000,
    "category": "crypto",
    "hour": 3,
    "recipient": "External Wallet"
}

headers = {
    "X-Sentinel-Key": API_KEY,
    "Content-Type": "application/json"
}

print(f"--- Sending request to Sentinel AI ---")
try:
    response = requests.post(URL, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"AI Response: {json.dumps(response.json(), indent=4)}")
except Exception as e:
    print(f"Connection Error: {e}")
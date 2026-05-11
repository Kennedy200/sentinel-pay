# Sentinel-Pay: Intelligent Fraud Detection Ecosystem
**Research Project:** Intelligent Fraud Detection System for Digital Payment Platforms Using Machine Learning and Behavioral Analytics.

---

## 1. Project Overview
Sentinel-Pay is a production-grade AI middleware designed to solve the "False Positive" problem in Nigerian digital payments. While traditional bank security often blocks legitimate users due to rigid rules, Sentinel-Pay employs a **Hybrid Ensemble AI Architecture** that combines universal fraud knowledge with individual user "Behavioral DNA."

### The Problem
Nigeria loses over **₦12 Billion annually** to sophisticated fraud (SIM-swaps, account takeovers, and mule networks). Current systems have a **20%+ false positive rate**, frustrating legitimate customers and increasing operational costs for fintechs.

### The Solution: The Dual-Brain Engine
1. **The Global Brain:** An XGBoost model trained on **500,000 transactions** to recognize universal fraud signatures (Midnight drains, high-velocity spikes).
2. **The Local Brain:** A personalized Isolation Forest model trained specifically on a user's uploaded statement (OPay/PalmPay/Bank PDF) to define what is "Normal" for that individual.

---

## 2. Core Features
- 🛡️ **Behavioral DNA Factory:** Automated Python parser that extracts mathematical spending patterns from messy PDF/CSV statements.
- ⚡ **Real-Time Analysis:** Sub-100ms inference time using a Triple-Ensemble (XGBoost + Random Forest + Isolation Forest).
- 🔍 **Explainable AI (SHAP):** Transparent diagnostic reports explaining exactly why a transaction was flagged or blocked.
- 🔄 **Reinforcement Learning:** A feedback loop allowing users to authorize flagged transfers and instantly retrain the AI.
- 🔌 **Developer Hub:** A SaaS-style platform for external banks to integrate the Sentinel Engine via secure API Keys (`sp_live_`).

---

## 3. Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, TypeScript, Vite, Framer Motion, Recharts |
| **Backend** | Python, Django REST Framework, SimpleJWT |
| **AI / ML** | XGBoost, Scikit-Learn, Joblib, SHAP |
| **Data** | Pandas, PDFPlumber, Regex |
| **Database** | PostgreSQL / SQLite, Redis (Caching) |

---

## 4. System Requirements
- **Python:** 3.10+
- **Node.js:** 18+ (LTS)
- **Memory:** 8GB RAM (Minimum for model loading)
- **Environment:** Virtualenv (Backend)# sentinel-pay


To start your backend, open your terminal (Git Bash) and run these commands in
order:

1. Activate the Backend

# 1. Enter the backend folder
cd backend

# 2. Activate the virtual environment
source venv/Scripts/activate

# 3. Start the server
python manage.py runserver

(You should now see the (venv) prefix in your terminal and the message:
"Starting development server at http://127.0.0.1:8000/")

2. Start the Frontend (In a separate terminal)

Don't forget to start your React app in another window so they can talk to each
other:

# 1. Enter the frontend folder
cd frontend

# 2. Start the Vite dev server
npm run dev

Quick Troubleshooting:

  - If you get a "No module named django" error: Make sure you see (venv) at the
    start of your terminal line. If not, the source command didn't work.
  - If the server crashes on start: Check if you need to run migrations (python
    manage.py migrate).

You're back in business! Let me know if you need anything else. 🛡️🚀


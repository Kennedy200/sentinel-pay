import pdfplumber
import re
from .models import HistoricalTransaction

def categorize_merchant(text):
    """
    Sleek keyword mapping to categorize Nigerian transactions.
    """
    text = text.lower()
    
    # 1. Gaming & Betting
    if any(k in text for k in ['bet', 'sporty', 'nairabet', '1xbet', 'gaming', 'lottery']):
        return 'Gaming'
    
    # 2. Utilities & Airtime
    if any(k in text for k in ['airtime', 'mtn', 'glo', 'airtel', '9mobile', 'data', 'ekedc', 'phed', 'dstv', 'gotv', 'vtpass']):
        return 'Utilities'
    
    # 3. Transfers
    if any(k in text for k in ['trf', 'transfer', 'to:', 'from:', 'mobile app']):
        return 'Transfers'
    
    # 4. Shopping & POS
    if any(k in text for k in ['pos', 'checkout', 'paystack', 'flutterwave', 'market', 'store', 'supermarket']):
        return 'Shopping'
    
    return 'Others'

def extract_dna_from_file(file_path, user_obj):
    """
    Enhanced Intelligence: Extracts Amounts, Times, and Real Categories.
    Saves every data point to the database for AI training.
    """
    valid_amounts = []
    valid_hours = []
    
    # Track categories found in this specific PDF
    category_counts = {}

    # Wipe old data for a fresh training session
    HistoricalTransaction.objects.filter(user=user_obj).delete()

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                
                # Split text into lines to better associate merchants with amounts
                lines = text.split('\n')
                
                for line in lines:
                    # 1. Try to find an amount in the line
                    amt_match = re.findall(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', line)
                    if not amt_match:
                        continue
                    
                    try:
                        # Take the last amount found on the line (usually the transaction value)
                        val = float(amt_match[-1].replace(',', ''))
                        
                        # Filter out balance numbers or noise
                        if 50.0 < val < 10000000:
                            valid_amounts.append(val)
                            
                            # 2. Determine Category based on keywords in the line
                            category = categorize_merchant(line)
                            
                            # Tally for the summary stats
                            category_counts[category] = category_counts.get(category, 0) + 1
                            
                            # 3. Save as a Historical Data Point for the AI
                            HistoricalTransaction.objects.create(
                                user=user_obj,
                                amount=val,
                                description=line[:250], # Store first 250 chars as description
                                category=category
                            )
                    except:
                        continue

                    # 4. Extract hours from any time stamps in the line
                    time_match = re.findall(r'(\d{1,2}:\d{2}(?:\s?[APM]{2})?)', line)
                    for t in time_match:
                        try:
                            hour = int(t.split(':')[0])
                            if 'PM' in t.upper() and hour < 12:
                                hour += 12
                            elif 'AM' in t.upper() and hour == 12:
                                hour = 0
                            valid_hours.append(hour)
                        except:
                            continue

        if not valid_amounts:
            return None

        # Format category counts for the Recharts Pie Chart
        # Transforms {'Transfers': 10, 'Gaming': 5} into [{"name": "Transfers", "value": 10}, ...]
        merchant_stats = []
        for name, count in category_counts.items():
            merchant_stats.append({"name": name, "value": count})

        # Final DNA Summary for BehavioralProfile baseline
        return {
            "avg_amount": sum(valid_amounts) / len(valid_amounts),
            "max_amount": max(valid_amounts),
            "active_hours": list(set(valid_hours)),
            "merchants": merchant_stats,
            "total_count": len(valid_amounts)
        }

    except Exception as e:
        print(f"CRITICAL PARSER ERROR: {str(e)}")
        return None
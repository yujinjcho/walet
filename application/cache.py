from datetime import timedelta, datetime

cached_data = {}
ttl = timedelta(days=3)

def get_transactions(account_id, month):
    key = str(account_id) + '-' + month
    if key not in cached_data:
        return None

    data = cached_data[key]
    now = datetime.now()
    if now - data['date'] > ttl:
        return None

    return data['transactions']

def store_transactions(account_id, month, transactions):
    now = datetime.now()
    key = str(account_id) + '-' + month

    cached_data[key] = {
        'date': now,
        'transactions': transactions
    }

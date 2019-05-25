from datetime import timedelta, datetime

cached_data = {}
ttl = timedelta(hours=12)

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

def clear_cache(account_id):
    for key, data in cached_data.items():
        user_id, month = key.split('-')
        if user_id == str(account_id):
            cached_data.pop(user_id)

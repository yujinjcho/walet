import calendar
import jwt
from datetime import datetime, timedelta
from cryptography.fernet import Fernet

from application import app

f = Fernet(app.config['SECRET_KEY'])
date_pattern = '%Y-%m-%d'

def extract_categories(transactions):
    'selecting top level categories'

    categories = [
        transaction['category'][0]
        for transaction in transactions if len(transaction['category']) > 0
    ]
    return list(set(categories))

def encrypt(s):
    return f.encrypt(s.encode()).decode('utf-8')

def decrypt(s):
    return f.decrypt(s.encode()).decode('utf-8')

def start_end_of_month(month, year):
    month = int(month)
    start_day, num_of_days = calendar.monthrange(year, month)
    start_date = datetime(year, month, 1).strftime(date_pattern)
    end_date = datetime(year, month, num_of_days).strftime(date_pattern)
    return start_date, end_date

def recent_range():
    end = datetime.now()
    start = end - timedelta(days=30)
    return start.strftime(date_pattern), end.strftime(date_pattern)


def generate_jwt(account_id):
    return jwt.encode({'account_id': account_id}, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')

def decode_jwt(encoded):
    try:
        return jwt.decode(encoded, app.config['SECRET_KEY'], algorithms=['HS256'])['account_id'][0]
    except jwt.exceptions.DecodeError:
        return None

def validate_request(request):
    jwt = request.headers.get('X-Auth-Token', 'n/a')
    account_id = decode_jwt(jwt)
    return account_id

import os

env = os.environ

APPLICATION_ENVIRONMENT = env.get('APPLICATION_ENVIRONMENT', 'development')

SECRET_KEY = env.get('SECRET_KEY')

DB = {
    'dbname': env.get('DB_NAME'),
    'password': env.get('DB_PASSWORD'),
    'user': env.get('DB_USER'),
    'port': env.get('DB_PORT'),
    'host': env.get('DB_HOST')
}

PLAID = {
    'client_id': env.get('PLAID_CLIENT_ID'),
    'secret': env.get('PLAID_SECRET'),
    'public_key': env.get('PLAID_PUBLIC_KEY'),
    'environment': env.get('PLAID_ENVIRONMENT')
}

GOOGLE_CLIENT_SECRET_CONFIG = env.get('GOOGLE_CLIENT_SECRET_CONFIG')
GOOGLE_AUTH = {
    'client_id': env.get('GOOGLE_CLIENT_ID'),
    'client_secret': env.get('GOOGLE_CLIENT_SECRET'),
    'auth_redirect': env.get('GOOGLE_AUTH_REDIRECT')
}

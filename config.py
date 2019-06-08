import os

env = os.environ

APPLICATION_ENVIRONMENT = env.get('APPLICATION_ENVIRONMENT', 'development')

SECRET_KEY = env['SECRET_KEY']

DB = {
    'dbname': env['DB_NAME'],
    'password': env.get('DB_PASSWORD', None),
    'user': env['DB_USER'],
    'port': env['DB_PORT'],
    'host': env['DB_HOST']
}

PLAID = {
    'client_id': env['PLAID_CLIENT_ID'],
    'secret': env['PLAID_SECRET'],
    'public_key': env['PLAID_PUBLIC_KEY'],
    'environment': env['PLAID_ENVIRONMENT']
}

GOOGLE_CLIENT_SECRET_CONFIG = env['GOOGLE_CLIENT_SECRET_CONFIG']
GOOGLE_AUTH = {
    'client_id': env['GOOGLE_CLIENT_ID'],
    'client_secret': env['GOOGLE_CLIENT_SECRET'],
    'auth_redirect': env['GOOGLE_AUTH_REDIRECT']
}

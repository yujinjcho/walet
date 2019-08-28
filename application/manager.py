import json

from application import google_auth
from application import data
from application import helper
from application import plaid

from plaid.errors import APIError


def handle_auth_callback(request, session):
    access_token, refresh_token = google_auth.handle_auth_callback(request, session)
    account_id = handle_account(access_token, refresh_token)
    return helper.generate_jwt(account_id)

def handle_account(access_token, refresh_token):
    user_info = google_auth.get_user_info(access_token, refresh_token)
    email = user_info['email']
    if not email:
        raise Exception('auth user has no email')

    account_ids = data.account_by_email(email)
    encrypted_token = helper.encrypt(access_token)
    encrypted_refresh_token = helper.encrypt(refresh_token) if refresh_token else None

    if account_ids:
        data.update_account(account_ids[0], encrypted_token, encrypted_refresh_token)
        return account_ids[0]

    data.create_account(email, encrypted_token, encrypted_refresh_token)
    new_account_ids = data.account_by_email(email)
    account_id = new_account_ids[0]

    data.create_tag(account_id, 'exclude')
    return account_id

def get_plaid_accounts(account_id):
    tokens = [token[1] for token in data.access_tokens(account_id)]
    accounts = plaid.accounts(account_id, tokens)
    accounts_info = [
        {
            'item_id': account['item']['item_id'],
            'institution_id': account['item']['institution_id'],
            'names': [x.get('name', 'Other') for x in account['accounts']],
            'official_names': [x.get('official_name', 'Other') for x in account['accounts']]
        }
        for account in accounts
    ]
    return { 'result': accounts_info }

def create_plaid_accounts(account_id, public_token):
    access_info = plaid.access_token(public_token)
    item_id = access_info['item_id']
    access_token = access_info['access_token']
    encrypted_access_token = helper.encrypt(access_token)
    return data.save_access_token(encrypted_access_token, item_id, account_id)

def get_transactions(account_id, month):
    # {item_id: token}
    tokens = {token[0]: token[1] for token in data.access_tokens(account_id)}

    transactions = []
    error = None
    for item_id, token in tokens.items():

        stored_transactions = [x[0] for x in data.get_transactions(account_id, item_id, month)]
        if stored_transactions:
            print(f"retrieving stored transactions for item_id: {item_id}")
            data.update_plaid_categories(helper.extract_categories(stored_transactions), account_id)
            transactions.extend(stored_transactions)
        else:
            try:
                item_transactions = plaid.transactions(account_id, month, token)

                db_transactions = [
                    (x['transaction_id'], account_id, json.dumps(x), x['date'], item_id)
                    for x in item_transactions
                ]
                print(f"persisting {len(item_transactions)} transactions for month: {month}, item_id: {item_id}")
                data.update_transactions(db_transactions)
                data.update_plaid_categories(helper.extract_categories(item_transactions), account_id)

            except APIError as e:
                print('plaid error e: {}'.format(e))
                error = "Could not retrieve transactions due to plaid API issues"
                item_transactions = []

            transactions.extend(item_transactions)

    settled_transactions = [t for t in transactions if not t['pending']]

    if error:
        result = { 'result': settled_transactions, 'error': error }
    else:
        result = { 'result': settled_transactions }

    return result

def get_budgets(account_id, month, year):
    budgets = data.budgets(account_id, month, year)
    if not budgets:
        # using -1 to represent default
        budgets = data.budgets(account_id, "-1", year)

    return budgets

def update_budgets(account_id, budget_update_request):
    month = budget_update_request['month']
    year = budget_update_request['year']
    data.delete_budgets(account_id, month, year)

    updated_budgets = [
        {
          'account_id': account_id,
          'month': month,
          'year': year,
          'category': budget['categoryName'],
          'budget': budget['budget']
        }
        for budget in budget_update_request['budgets']
        if budget['budget'] > 0
    ]
    return data.create_budgets(updated_budgets)


def handle_webhook(webhook):
    print(f"handling webhook: {webhook}")
    code = webhook['webhook_code']
    item_id = webhook['item_id']

    if code == "DEFAULT_UPDATE":
        tokens = data.access_token_by_item_id(item_id)
        if tokens:
            access_token, account_id = tokens[0]
            transactions = plaid.recent_transactions(item_id, access_token)
            db_transactions = [
                (x['transaction_id'], account_id, json.dumps(x), x['date'], item_id )
                for x in transactions
            ]
            data.update_plaid_categories(helper.extract_categories(transactions), account_id)
            result = data.update_transactions(db_transactions)
            print(f"updated rows: {result}")

    elif code == "TRANSACTIONS_REMOVED":
        result = data.delete_transactions(item_id, webhook['removed_transactions'])
        print(f"deleted rows: {result}")
    else:
        print(f"Ignoring webhook: {webhook}")

    return "success"



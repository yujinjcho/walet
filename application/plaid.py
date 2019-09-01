from plaid import Client

from application import app
from application import helper

plaid_conf = app.config['PLAID']

num_transactions = 500
client = Client(
    client_id = plaid_conf['client_id'],
    secret = plaid_conf['secret'],
    public_key = plaid_conf['public_key'],
    environment = plaid_conf['environment']
)

def annual_transactions(year, token):
    start, _ = helper.start_end_of_month('1', year)
    _, end = helper.start_end_of_month('12', year)
    access_token = helper.decrypt(token)
    print(f'retrieving transactions from {start} to {end}')
    return get_transations(access_token, start, end)

def recent_transactions(token, range_type='month'):
    start, end = helper.recent_range(range_type)
    access_token = helper.decrypt(token)
    return get_transations(access_token, start, end)

def get_transations(access_token, start, end):
    transactions = []
    response = client.Transactions.get(access_token, start_date=start, end_date=end, count=num_transactions)
    retrieved_transactions = response['transactions']
    transactions.extend(retrieved_transactions)

    offset = num_transactions
    while len(retrieved_transactions) == num_transactions:
        print(f'retrieving plaid transactions offset: {offset}')
        response = client.Transactions.get(access_token, start_date=start, end_date=end, count=num_transactions, offset=offset)
        retrieved_transactions = response['transactions']
        transactions.extend(retrieved_transactions)
        offset += num_transactions

    return transactions


def accounts(account_id, tokens):
    accounts = []
    for token in tokens:
        access_token = helper.decrypt(token)
        response = client.Accounts.get(access_token)
        accounts.append(response)

    return accounts

def access_token(public_token):
    response = client.Item.public_token.exchange(public_token)
    return response

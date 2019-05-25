import os
import json
from plaid import Client

from application import app
from application import helper

plaid_conf = app.config['PLAID']

year = 2019
client = Client(
    client_id = plaid_conf['client_id'],
    secret = plaid_conf['secret'],
    public_key = plaid_conf['public_key'],
    environment = plaid_conf['environment']
)

def transactions(account_id, month, tokens):
    transactions = []
    start, end = helper.start_end_of_month(month, year)

    for token in tokens:
        access_token = helper.decrypt(token)
        response = client.Transactions.get(access_token, start_date=start, end_date=end)
        transactions.extend(response['transactions'])

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

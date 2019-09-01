import os
from types import SimpleNamespace

os.environ['SECRET_KEY'] = 'GlI3iwrXMC8Wk4a_cvBid5tbW0DmdlnVWuc77XXiEv9='

from application import manager


def test_get_budgets():

    manager.data = SimpleNamespace()

    # month has budget
    def mock_budgets(account_id, month, year):
        return [('Grocery', 300), ('Travel', 150)]
    manager.data.budgets = mock_budgets

    budgets = manager.get_budgets('123', '4', '2019')
    assert len(budgets) == 2

    # month does not have budget but default
    def mock_budgets(account_id, month, year):
        if month != '-1':
            return []
        return [('Grocery', 300)]
    manager.data.budgets = mock_budgets
    budgets = manager.get_budgets('123', '4', '2019')
    assert len(budgets) == 1
    assert budgets[0][0] == 'Grocery'

def test_update_budgets():
    manager.data = SimpleNamespace()

    def delete_budgets(account_id, month, year):
        assert account_id == '123'
        assert month == '4'
        assert year == '2019'

    manager.data.delete_budgets = delete_budgets

    def create_budgets(updated_budgets):
        assert len(updated_budgets) == 2
        assert updated_budgets[0]['category'] == 'Grocery'
        assert updated_budgets[0]['budget'] == 100
        assert updated_budgets[1]['category'] == 'Shops'
        assert updated_budgets[1]['budget'] == 50
        return 2

    manager.data.create_budgets = create_budgets

    budget_request = {
       'month': '4',
       'year': '2019',
       'budgets': [
           {'categoryName': 'Grocery', 'budget': 100},
           {'categoryName': 'Shops', 'budget': 50},
           {'categoryName': 'Misc', 'budget': 0}
       ]
    }
    updated = manager.update_budgets('123', budget_request)
    assert updated == 2

def test_handle_webhook():
    manager.data = SimpleNamespace()
    manager.plaid = SimpleNamespace()

    def access_token_by_item_id(item_id):
        assert item_id == '123'
        return [('token_id', 'account_id')]
    manager.data.access_token_by_item_id = access_token_by_item_id

    def recent_transactions(item_id, access_token):
        assert item_id == '123'
        assert access_token == 'token_id'
        return [{'transaction_id': '2', 'date': '2019-09-10', 'category': ['Grocery']}]
    manager.plaid.recent_transactions = recent_transactions

    def update_plaid_categories(categories, account_id):
        assert categories == ['Grocery']
        assert account_id == 'account_id'
    manager.data.update_plaid_categories = update_plaid_categories

    def update_transactions(db_transactions):
        assert len(db_transactions) == 1
        assert db_transactions[0][0] == '2'
    manager.data.update_transactions = update_transactions

    webhook = {
        'webhook_code': 'DEFAULT_UPDATE',
        'item_id': '123'
    }
    manager.handle_webhook(webhook)

    def delete_transactions(item_id, transactions):
        assert item_id == '123'
        assert transactions == ['t1']

    manager.data.delete_transactions = delete_transactions
    webhook = {
        'webhook_code': 'TRANSACTIONS_REMOVED',
        'removed_transactions': ['t1'],
        'item_id': '123'
    }
    manager.handle_webhook(webhook)

import os
from types import SimpleNamespace

os.environ['SECRET_KEY'] = 'GlI3iwrXMC8Wk4a_cvBid5tbW0DmdlnVWuc77XXiEv9='

from application import manager


def test_get_budgets():

    manager.data_layer = SimpleNamespace()

    # month has budget
    def mock_budgets(account_id, month, year):
        return [('Grocery', 300), ('Travel', 150)]
    manager.data_layer.budgets = mock_budgets

    budgets = manager.get_budgets('123', '4', '2019')
    assert len(budgets) == 2

    # month does not have budget but default
    def mock_budgets(account_id, month, year):
        if month != '-1':
            return []
        return [('Grocery', 300)]
    manager.data_layer.budgets = mock_budgets
    budgets = manager.get_budgets('123', '4', '2019')
    assert len(budgets) == 1
    assert budgets[0][0] == 'Grocery'

def test_update_budgets():
    manager.data_layer = SimpleNamespace()

    def delete_budgets(account_id, month, year):
        assert account_id == '123'
        assert month == '4'
        assert year == '2019'

    manager.data_layer.delete_budgets = delete_budgets

    def create_budgets(updated_budgets):
        assert len(updated_budgets) == 2
        assert updated_budgets[0]['category'] == 'Grocery'
        assert updated_budgets[0]['budget'] == 100
        assert updated_budgets[1]['category'] == 'Shops'
        assert updated_budgets[1]['budget'] == 50
        return 2

    manager.data_layer.create_budgets = create_budgets

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

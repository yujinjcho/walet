import os

os.environ['SECRET_KEY'] = 'GlI3iwrXMC8Wk4a_cvBid5tbW0DmdlnVWuc77XXiEv9='

from application import manager


def test_get_budgets():

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

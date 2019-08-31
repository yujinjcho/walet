import psycopg2
from psycopg2.extras import execute_values

from application import app

def tags(account_id):
    'return all tags for user'

    return _select('SELECT tag FROM tag WHERE account_id = %s', (account_id,))

def tag_rules(account_id):
    'return all tag rules for account'

    query = """
      SELECT
        tr.target_type,
        tr.target_value,
        array_agg(t.tag) AS tags
      FROM tag_rule tr
      LEFT JOIN tag t ON tr.tag_id = t.tag_id
      WHERE tr.account_id = %s
      GROUP BY tr.target_type, tr.target_value
    """
    return _select(query, (account_id,))

def budgets(account_id, month, year):
    query = """
      SELECT
        b.category,
        b.budget
      FROM budget b
      WHERE b.account_id = %s
        AND b.month = %s
        AND b.year = %s
    """
    return _select(query, (account_id, month, year))

def delete_budgets(account_id, month, year):
    query = """
      DELETE FROM budget
        WHERE account_id = %s
          AND month = %s
          AND year = %s
    """
    return _delete(query, (account_id, month, year))

def create_budgets(budgets):
    query = """
      INSERT INTO budget (account_id, month, year, category, budget)
        VALUES %s
    """
    budget_params = [
        (b['account_id'], b['month'], b['year'], b['category'], b['budget'])
        for b in budgets
    ]
    db = _connection()
    try:
        with db.cursor() as cur:
            execute_values(cur, query, budget_params)
            updated = cur.rowcount
        db.commit()
    finally:
        db.close()

    return updated


def categories(account_id):
    'return all categories for user'

    return _select('SELECT category FROM category WHERE account_id = %s', (account_id,))

def category_rules(account_id):
    'return all category rules for the account'

    query = """
      SELECT
        cr.target_type,
        cr.target_value,
        c.category
      FROM category_rule cr
      LEFT JOIN category c ON c.category_id = cr.category_id
      WHERE cr.account_id = %s
    """
    return _select(query, (account_id,))

def create_category_rule(account_id, rule):
    '''
    do not allow multiple categories to apply for a given set of:
    account_id, target_type, target_value

    override with new value if there is a conflict
    '''

    query = """
      INSERT INTO category_rule (account_id, target_type, target_value, category_id)
        SELECT %s, %s, %s, category_id
        FROM (
          SELECT category_id
          FROM category
          WHERE category=%s AND account_id=%s
        ) q
        ON CONFLICT (account_id, target_type, target_value)
          DO UPDATE
          SET category_id = excluded.category_id
    """
    params = (account_id, rule['target_type'], rule['target_value'], rule['category'], account_id)
    return _insert(query, params)

def create_tag_rule(account_id, rule):
    '''
    allow multiple tags for a given account_id, target_type, target_value,
    but not duplicate rows
    '''

    query = """
      INSERT INTO tag_rule (account_id, target_type, target_value, tag_id)
        SELECT %s, %s, %s, tag_id
        FROM (
          SELECT tag_id
          FROM tag
          WHERE tag=%s
        ) q
        ON CONFLICT (account_id, target_type, target_value, tag_id)
        DO NOTHING
    """
    params = (account_id, rule['target_type'], rule['target_value'], rule['tag'])
    return _insert(query, params)

def update_plaid_categories(categories, account_id):
    query = """
      INSERT INTO category (category, account_id)
        VALUES %s
        ON CONFLICT (category, account_id)
        DO NOTHING
    """
    db = _connection()
    try:
        with db.cursor() as cur:
            execute_values(cur, query, [(x, account_id) for x in categories])
            updated = cur.rowcount
        db.commit()
    finally:
        db.close()

    return updated

def create_tag(account_id, tag):
    query = """
      INSERT INTO tag (tag, account_id)
        VALUES (%s, %s)
        ON CONFLICT (tag, account_id)
        DO NOTHING
    """
    return _insert(query, (tag, account_id))

def create_category(account_id, category):
    query = """
      INSERT INTO category (category, account_id)
        VALUES (%s, %s)
        ON CONFLICT (category, account_id)
        DO NOTHING
    """
    return _insert(query, (category, account_id))

def access_tokens(account_id):
    return _select('SELECT item_id, access_token FROM plaid_items WHERE account_id = %s', (account_id,))

def access_token_by_item_id(item_id):
    return _select("SELECT access_token, account_id FROM plaid_items WHERE item_id = %s", (item_id,))

def save_access_token(access_token, item_id, account_id):
    query = """
      INSERT INTO plaid_items (access_token, item_id, account_id)
        VALUES (%s, %s, %s)
    """
    return _insert(query, (access_token, item_id, account_id))

def store_auth_token(account_id, token):
    query = """
      UPDATE account
        SET google_auth_token = %s
      WHERE account_id = %s
    """
    return _insert(query, (token, account_id))

def account_by_email(email):
    query = """
      SELECT account_id
      FROM account
      WHERE email = %s
    """
    return _select(query, (email,))

def update_account(account_id, access_token, refresh_token):
    print('updating account')
    if refresh_token:
        query = """
          UPDATE account
            SET google_auth_token = %s,
                google_refresh_token = %s
          WHERE account_id = %s
        """
        return _insert(query, (access_token, refresh_token, account_id))

    query = """
      UPDATE account
        SET google_auth_token = %s
      WHERE account_id = %s
    """
    return _insert(query, (access_token, account_id))

def create_account(email, access_token, refresh_token):
    print('creating account')
    query = """
      INSERT INTO account (google_auth_token, google_refresh_token, email)
        VALUES (%s, %s, %s)
    """
    return _insert(query, (access_token, refresh_token, email))

def get_transactions(account_id, item_id, month):
    query = """
        SELECT data
        FROM plaid_transactions
        WHERE
          account_id = %s
          AND item_id = %s
          AND DATE_PART('month', transaction_date) = %s
    """
    return _select(query, (account_id, item_id, month))

def get_annual_transactions(account_id, item_id, year):
    query = """
        SELECT data
        FROM plaid_transactions
        WHERE
          account_id = %s
          AND item_id = %s
          AND DATE_PART('year', transaction_date) = %s
    """
    return _select(query, (account_id, item_id, year))

def update_transactions(transactions):
    query = """
      INSERT INTO plaid_transactions (transaction_id, account_id, data, transaction_date, item_id)
        VALUES %s
        ON CONFLICT (account_id, transaction_id)
          DO UPDATE
          SET data = excluded.data
    """
    db = _connection()
    try:
        with db.cursor() as cur:
            execute_values(cur, query, transactions)
            updated = cur.rowcount
        db.commit()
    finally:
        db.close()

    return updated

def delete_transactions(item_id, transaction_ids):
    print(f"deleting transactions: {transaction_ids}")
    params = (item_id, tuple(transaction_ids))
    query = """
      DELETE FROM plaid_transactions
        WHERE item_id = %s
          AND transaction_id in %s
    """
    return _delete(query, params)

def store_message(email, subject, message):
    query = """
      INSERT INTO message (email, subject, message)
        VALUES (%s, %s, %s)
    """
    return _insert(query, (email, subject, message))

def _insert(query, params):
    db = _connection()
    try:
        with db.cursor() as cur:
            cur.execute(query, params)
            updated_rows = cur.rowcount
        cur.close()
        db.commit()
    finally:
        db.close()

    return updated_rows

def _select(query, params = None):
    try:
        db = _connection()
        with db.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)

            results = cur.fetchall()
        cur.close()
    finally:
        db.close()

    return results

def _delete(query, params):
    try:
        db = _connection()
        with db.cursor() as cur:
            cur.execute(query, params)
            updated_rows = cur.rowcount

        db.commit()
        cur.close()
    finally:
        db.close()

    return updated_rows

def _connection():
    return psycopg2.connect(**app.config['DB'])

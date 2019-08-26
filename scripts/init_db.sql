
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_name TEXT,
  email TEXT
);

CREATE TABLE category (
  category_id    SERIAL PRIMARY KEY,
  category       TEXT,
  account_id     INTEGER REFERENCES account(account_id)
);

CREATE TABLE tag (
  tag_id         SERIAL PRIMARY KEY,
  tag            TEXT,
  account_id     INTEGER REFERENCES account(account_id)
);

CREATE TABLE category_rule (
  category_rule_id  SERIAL PRIMARY KEY,
  account_id        INTEGER REFERENCES account(account_id),
  target_type       TEXT NOT NULL,
  target_value      TEXT NOT NULL,
  category_id       INTEGER REFERENCES category(category_id)
);

CREATE TABLE tag_rule (
  tag_rule_id       SERIAL PRIMARY KEY,
  account_id        INTEGER REFERENCES account(account_id),
  target_type       TEXT NOT NULL,
  target_value      TEXT NOT NULL,
  tag_id            INTEGER REFERENCES tag(tag_id)
);

CREATE TABLE plaid_items (
  item_id        TEXT,
  access_token   TEXT,
  account_id     INTEGER REFERENCES account(account_id)
);

CREATE UNIQUE INDEX ON category_rule (account_id, target_type, target_value);
CREATE UNIQUE INDEX ON tag_rule (account_id, target_type, target_value, tag_id);
CREATE UNIQUE INDEX ON category (account_id, category);
CREATE UNIQUE INDEX ON tag (account_id, tag);
CREATE INDEX ON category (account_id);
CREATE UNIQUE INDEX ON account (email);

-- test data
INSERT INTO account (account_name)
  VALUES ('default'), ('test2');

INSERT INTO tag (tag, account_id)
  VALUES ('exclude', 2), ('fixed', 2);

ALTER TABLE account ADD COLUMN google_auth_token TEXT;
CREATE UNIQUE INDEX ON account (account_id, google_auth_token);

CREATE UNIQUE INDEX ON account (email);
ALTER TABLE account ADD COLUMN google_refresh_token TEXT;

CREATE UNIQUE INDEX ON plaid_items (item_id);
CREATE TABLE plaid_transactions (
  transaction_id    TEXT PRIMARY KEY,
  account_id        INTEGER REFERENCES account(account_id),
  data              JSON,
  transaction_date  DATE,
  item_id           TEXT REFERENCES plaid_items(item_id),
  UNIQUE            (transaction_id, account_id)
);

CREATE TABLE message (
  message_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL
);

-- apply starting here
CREATE TABLE budget (
  budget_id         SERIAL PRIMARY KEY,
  account_id        INTEGER REFERENCES account(account_id),
  month             INT,
  year              INT,
  category          TEXT,
  budget            INT
);

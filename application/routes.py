import os

from flask import jsonify, request, redirect, session, abort

from application import app
from application import data
from application import plaid
from application import helper
from application import google_auth
from application import manager

@app.route('/', methods=['GET'])
def root():
    return 'Ok'

@app.route('/api/tags', methods=['GET'])
def tags():
    account_id = helper.validate_request(request)
    if account_id:
        result = [tag[0] for tag in data.tags(account_id)]
        return jsonify({'result': result})

    return abort(400)

@app.route('/api/tag_rules', methods=['GET'])
def tag_rules():
    account_id = helper.validate_request(request)

    if account_id:
        result = [
            {
                'target_type': rule[0],
                'target_value': rule[1],
                'tags': rule[2]
            }
            for rule in data.tag_rules(account_id)
        ]
        return jsonify({'result': result})

    return abort(400)

@app.route('/api/tag_rules', methods=['POST'])
def create_tag_rule():
    rule = request.json
    account_id = helper.validate_request(request)

    if account_id:
        updated = data.create_tag_rule(account_id, rule)
        data.create_tag(account_id, rule['tag'])
        return jsonify({'result': {'updated_count': updated}})

    return abort(400)

@app.route('/api/categories', methods=['GET'])
def categories():
    account_id = helper.validate_request(request)

    if account_id:
        result = [category[0] for category in data.categories(account_id)]
        return jsonify({'result': result})

    return abort(400)

@app.route('/api/category_rules', methods=['GET'])
def category_rules():
    account_id = helper.validate_request(request)
    if account_id:
        result = [
            {
                'target_type': rule[0],
                'target_value': rule[1],
                'category': rule[2]
            }
            for rule in data.category_rules(account_id)
        ]
        return jsonify({'result': result})

    return abort(400)


@app.route('/api/category_rules', methods=['POST'])
def create_category_rule():
    rule = request.json
    account_id = helper.validate_request(request)
    if account_id:
        data.create_category(account_id, rule['category'])
        updated = data.create_category_rule(account_id, rule)
        return jsonify({'result': {'updated_count': updated}})
    return abort(400)

@app.route('/api/transactions', methods=['GET'])
def transactions():
    month = request.args.get('month')
    account_id = helper.validate_request(request)

    if account_id:
        account_transactions = manager.get_transactions(account_id, month)
        return jsonify({'result': account_transactions})

    return abort(400)

@app.route('/api/plaid_accounts', methods=['GET'])
def plaid_accounts():
    account_id = helper.validate_request(request)

    if account_id:
        accounts = manager.get_plaid_accounts(account_id)
        return jsonify({ 'result': accounts })

    return abort(400)

@app.route('/api/plaid_accounts', methods=['POST'])
def create_plaid_accounts():
    public_token = request.json['publicToken']
    account_id = helper.validate_request(request)

    if account_id:
        accounts = manager.create_plaid_accounts(account_id, public_token)
        return jsonify({'result': accounts})

    return abort(400)

@app.route('/api/auth/login', methods=['GET'])
def auth_login():
    return jsonify({'result': google_auth.auth_url(session)})

@app.route('/api/auth/callback', methods=['GET'])
def auth_callback():
    jwt = manager.handle_auth_callback(request, session)
    base_url = app.config['GOOGLE_AUTH']['auth_redirect']
    url = '{}?jwt={}'.format(base_url, jwt)
    return redirect(url)

@app.route('/api/auth/user_info', methods=['GET'])
def auth_user_info():
    access_token = app.config['GOOGLE_AUTH']['access_token']
    refresh_token = app.config['GOOGLE_AUTH']['refresh_token']
    res = google_auth.get_user_info(access_token, refresh_token)
    return jsonify(res)

@app.route('/api/validate/account', methods=['GET'])
def validate_account():
    account_id = helper.validate_request(request)
    response = jsonify({'result': account_id}) if account_id else abort(400)
    return response

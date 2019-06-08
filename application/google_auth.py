import json

from flask import url_for
import google.oauth2.credentials
import google_auth_oauthlib.flow
from google.auth.transport.requests import AuthorizedSession
from google_auth_oauthlib.helpers import credentials_from_session

from application import app

google_scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
auth_callback = 'auth_callback'

def auth_url(session):
    flow = _get_client()
    flow.redirect_uri = url_for(auth_callback, _external=True)
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )

    session['state'] = state
    return authorization_url

def handle_auth_callback(request, session):
    state = session.get('state', None)
    flow = _get_client(state)
    flow.redirect_uri = url_for(auth_callback, _external=True)
    authorization_response = request.url.strip()
    flow.fetch_token(authorization_response=authorization_response)
    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    return credentials.token, credentials.refresh_token

def get_user_info(access_token, refresh_token):
    credentials = google.oauth2.credentials.Credentials(**_get_credentials(access_token, refresh_token))
    authed_session = AuthorizedSession(credentials)
    return authed_session.get('https://www.googleapis.com/userinfo/v2/me').json()

def _get_client(state=None):
    secret_config = json.loads(app.config['GOOGLE_CLIENT_SECRET_CONFIG'])

    if state is None:
        return google_auth_oauthlib.flow.Flow.from_client_config(
            secret_config,
            scopes=google_scopes
        )

    return google_auth_oauthlib.flow.Flow.from_client_config(
        secret_config,
        scopes=google_scopes,
        state=state
    )

def _get_credentials(access_token, refresh_token):
    auth_config = app.config['GOOGLE_AUTH']
    return {
        'token': access_token,
        'refresh_token': refresh_token,
        'token_uri': 'https://oauth2.googleapis.com/token',
        'client_id': auth_config['client_id'],
        'client_secret': auth_config['client_secret']
    }


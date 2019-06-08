import os
from flask import Flask
from flask_cors import CORS

from config import APPLICATION_ENVIRONMENT


def create_app():
    if APPLICATION_ENVIRONMENT == 'production':
        flask_options = {'static_folder':'build/static', 'template_folder':'build'}
    else:
        flask_options = {}

    app = Flask(__name__, **flask_options)

    CORS(app)
    app.config.from_object('config')

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app


app = create_app()

import application.routes

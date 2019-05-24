import os
from flask import Flask


def create_app():
    app = Flask(__name__, static_folder='build/static', template_folder='build')
    app.config.from_object('config')

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    return app


app = create_app()

import application.routes

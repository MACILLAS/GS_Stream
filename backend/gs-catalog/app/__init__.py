from flask import Flask
from flask_cors import CORS
from .api.routes import configure_routes


def create_app():
    app = Flask(__name__)
    CORS(app)
    configure_routes(app)

    return app

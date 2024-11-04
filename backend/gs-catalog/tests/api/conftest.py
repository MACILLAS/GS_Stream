import pytest
import sys
import os
import mongomock
from flask import current_app


# Add the parent directory of the current file to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.api.annotations import get_annotations_collection
from app import create_app

@pytest.fixture
def client():
    os.environ['FLASK_DEBUG'] = 'testing'
    app = create_app()
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            current_app.mongo_client = mongomock.MongoClient()
            yield client

@pytest.fixture(autouse=True)
def reset_annotations(client):
    with client.application.app_context():
        client = current_app.mongo_client
        client.drop_database('annotations_test_db') 
import pytest
import sys
import os
from flask import current_app
from pymongo import MongoClient

# Add project path to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app

@pytest.fixture
def client():
    os.environ['FLASK_DEBUG'] = 'testing'
    app = create_app()
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            # Set up actual MongoDB client
            current_app.mongo_client = MongoClient('mongodb://localhost:27017/')
            yield client

@pytest.fixture(autouse=True)
def reset_annotations(client):
    with client.application.app_context():
        client = current_app.mongo_client
        # Get test database name
        db_name = 'annotations_test_db'
        # Initialize database
        client.drop_database(db_name)

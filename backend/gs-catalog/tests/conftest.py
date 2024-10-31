import pytest
import sys
import os

# Add the parent directory of the current file to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
import app.api.annotations as a


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            yield client

@pytest.fixture(autouse=True)
def reset_annotations():
    a.annotations.clear() 
    a.next_id = 1
    
def pytest_runtest_call(item):
    test_num = item.session.items.index(item) + 1
    item.user_properties.append(("test_num", test_num))
# backend/tests/groups_test.py
import pytest
from flask import Flask
from backend.routes.groups import groups_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(groups_bp)
    return app

def test_get_groups(client):
    response = client.get('/api/groups/')
    assert response.status_code == 200

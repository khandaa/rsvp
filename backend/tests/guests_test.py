# backend/tests/guests_test.py
import pytest
from flask import Flask
from backend.routes.guests import guests_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(guests_bp)
    return app

def test_get_guests(client):
    response = client.get('/api/guests/')
    assert response.status_code == 200

# Additional tests for POST, PUT, DELETE, BULK can be added here

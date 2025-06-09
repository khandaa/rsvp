# backend/tests/notifications_test.py
import pytest
from flask import Flask
from backend.routes.notifications import notifications_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(notifications_bp)
    return app

def test_get_notifications(client):
    response = client.get('/api/notifications/')
    assert response.status_code == 200

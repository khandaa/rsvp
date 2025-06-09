# backend/tests/events_test.py
import pytest
from flask import Flask
from backend.routes.events import events_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(events_bp)
    return app

def test_get_events(client):
    response = client.get('/api/events/')
    assert response.status_code == 200

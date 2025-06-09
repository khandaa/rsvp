# backend/tests/rsvp_test.py
import pytest
from flask import Flask
from backend.routes.rsvp import rsvp_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(rsvp_bp)
    return app

def test_rsvp_summary(client):
    response = client.get('/api/rsvp/summary')
    assert response.status_code == 200

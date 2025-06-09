# backend/tests/logistics_test.py
import pytest
from flask import Flask
from backend.routes.logistics import logistics_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(logistics_bp)
    return app

def test_get_logistics(client):
    response = client.get('/api/logistics/')
    assert response.status_code == 200

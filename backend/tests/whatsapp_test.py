# backend/tests/whatsapp_test.py
import pytest
from flask import Flask
from backend.routes.whatsapp import whatsapp_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(whatsapp_bp)
    return app

def test_send_whatsapp(client):
    response = client.post('/api/whatsapp/send', json={"recipient": "+1234567890", "message": "Test"})
    assert response.status_code == 200

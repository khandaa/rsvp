# backend/tests/chatbot_test.py
import pytest
from flask import Flask
from backend.routes.chatbot import chatbot_bp

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(chatbot_bp)
    return app

def test_get_faq(client):
    response = client.get('/api/chatbot/faq')
    assert response.status_code == 200

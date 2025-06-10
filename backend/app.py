# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db
from routes.guests import guests_bp
from routes.groups import groups_bp
from routes.events import events_bp
from routes.logistics import logistics_bp
from routes.notifications import notifications_bp
from routes.rsvp import rsvp_bp
from routes.whatsapp import whatsapp_bp
from routes.chatbot import chatbot_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, methods=["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"])

# Register blueprints
app.register_blueprint(guests_bp)
app.register_blueprint(groups_bp)
app.register_blueprint(events_bp)
app.register_blueprint(logistics_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(rsvp_bp)
app.register_blueprint(whatsapp_bp)
app.register_blueprint(chatbot_bp)

# Initialize database
with app.app_context():
    init_db()

@app.route('/')
def index():
    return {'status': 'RSVP backend running'}

# Handle OPTIONS requests to support CORS preflight
@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

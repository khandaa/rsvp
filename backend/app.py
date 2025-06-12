# backend/app.py
from flask import Flask, jsonify, request, g
from flask_cors import CORS
import os
from database import close_db, init_db
from routes.guests import guests_bp
from routes.groups import groups_bp
from routes.rsvp import rsvp_bp
from routes.stay_arrangements import stay_arrangements_bp
from routes.events import events_bp
from routes.hotels import hotels_bp
from routes.rooms import rooms_bp
from routes.users import users_bp
from routes.chatbot import chatbot_bp
from routes.notifications import notifications_bp
from routes.logistics import logistics_bp
from routes.whatsapp import whatsapp_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key_change_in_production')
# This is a development secret key. In production, set a strong secret key via environment variable
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, methods=["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"])

# Register blueprints
app.register_blueprint(guests_bp, url_prefix='/api/guests')
app.register_blueprint(groups_bp, url_prefix='/api/groups')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(logistics_bp, url_prefix='/api/logistics')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(rsvp_bp, url_prefix='/api/rsvp')
app.register_blueprint(whatsapp_bp, url_prefix='/api/whatsapp')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
app.register_blueprint(hotels_bp, url_prefix='/api/hotels')
app.register_blueprint(rooms_bp, url_prefix='/api/rooms')
app.register_blueprint(users_bp, url_prefix='/api/users')

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
    import os
    port = int(os.environ.get('PORT', 5001))  # Default to port 5001 now
    app.run(host='0.0.0.0', port=port)

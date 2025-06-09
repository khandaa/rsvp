# backend/app.py
from flask import Flask
from flask_cors import CORS
from database import init_db
from routes.guests import guests_bp
from routes.groups import groups_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(guests_bp)
app.register_blueprint(groups_bp)

@app.before_first_request
def setup():
    init_db()

@app.route('/')
def index():
    return {'status': 'RSVP backend running'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

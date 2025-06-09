# backend/routes/rsvp.py
from flask import Blueprint, request, jsonify
from database import get_db

rsvp_bp = Blueprint('rsvp', __name__, url_prefix='/api/rsvp')

# Get RSVP summary dashboard
@rsvp_bp.route('/summary', methods=['GET'])
def rsvp_summary():
    db = get_db()
    summary = db.execute('''
        SELECT rsvp_status, COUNT(*) as count
        FROM guests
        GROUP BY rsvp_status
    ''').fetchall()
    return jsonify([{**dict(row)} for row in summary])

# Update RSVP status for a guest
@rsvp_bp.route('/<token>', methods=['POST'])
def update_rsvp(token):
    db = get_db()
    data = request.get_json()
    guest = db.execute('SELECT guest_id FROM rsvp_links WHERE token = ?', (token,)).fetchone()
    if not guest:
        return jsonify({'error': 'Invalid RSVP link'}), 404
    db.execute('UPDATE guests SET rsvp_status = ? WHERE id = ?', (data['rsvp_status'], guest['guest_id']))
    db.commit()
    return jsonify({'message': 'RSVP updated'})

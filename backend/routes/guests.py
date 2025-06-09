# backend/routes/guests.py
from flask import Blueprint, request, jsonify
from database import get_db

guests_bp = Blueprint('guests', __name__, url_prefix='/api/guests')

# Get all guests
@guests_bp.route('/', methods=['GET'])
def get_guests():
    db = get_db()
    guests = db.execute('SELECT * FROM guests').fetchall()
    return jsonify([dict(row) for row in guests])

# Get a single guest
@guests_bp.route('/<int:guest_id>', methods=['GET'])
def get_guest(guest_id):
    db = get_db()
    guest = db.execute('SELECT * FROM guests WHERE id = ?', (guest_id,)).fetchone()
    if guest is None:
        return jsonify({'error': 'Guest not found'}), 404
    return jsonify(dict(guest))

# Add a new guest
@guests_bp.route('/', methods=['POST'])
def add_guest():
    data = request.get_json()
    db = get_db()
    db.execute(
        'INSERT INTO guests (name, email, phone, group_id) VALUES (?, ?, ?, ?)',
        (data['name'], data['email'], data.get('phone'), data.get('group_id'))
    )
    db.commit()
    return jsonify({'message': 'Guest added'}), 201

# Update a guest
@guests_bp.route('/<int:guest_id>', methods=['PUT'])
def update_guest(guest_id):
    data = request.get_json()
    db = get_db()
    db.execute(
        'UPDATE guests SET name = ?, email = ?, phone = ?, group_id = ? WHERE id = ?',
        (data['name'], data['email'], data.get('phone'), data.get('group_id'), guest_id)
    )
    db.commit()
    return jsonify({'message': 'Guest updated'})

# Delete a guest
@guests_bp.route('/<int:guest_id>', methods=['DELETE'])
def delete_guest(guest_id):
    db = get_db()
    db.execute('DELETE FROM guests WHERE id = ?', (guest_id,))
    db.commit()
    return jsonify({'message': 'Guest deleted'})

# Bulk import guests
@guests_bp.route('/bulk', methods=['POST'])
def bulk_import_guests():
    guests = request.get_json()
    db = get_db()
    for guest in guests:
        db.execute(
            'INSERT INTO guests (name, email, phone, group_id) VALUES (?, ?, ?, ?)',
            (guest.get('name'), guest.get('email'), guest.get('phone'), guest.get('group_id'))
        )
    db.commit()
    return jsonify({'message': 'Bulk import successful'})

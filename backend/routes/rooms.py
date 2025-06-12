from flask import Blueprint, request, jsonify
from database import get_db

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/', methods=['GET'])
def get_rooms():
    db = get_db()
    rooms = db.execute('SELECT * FROM rooms').fetchall()
    return jsonify([dict(row) for row in rooms])

@rooms_bp.route('/<int:room_id>', methods=['GET'])
def get_room(room_id):
    db = get_db()
    room = db.execute('SELECT * FROM rooms WHERE id = ?', (room_id,)).fetchone()
    if room is None:
        return jsonify({'error': 'Room not found'}), 404
    return jsonify(dict(room))

@rooms_bp.route('/', methods=['POST'])
def add_room():
    if not request.json or not 'room_number' in request.json or not 'hotel_id' in request.json:
        return jsonify({'error': 'Room number and hotel ID are required'}), 400
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if hotel exists
    hotel = db.execute('SELECT id FROM hotels WHERE id = ?', (request.json['hotel_id'],)).fetchone()
    if hotel is None:
        return jsonify({'error': 'Hotel not found'}), 404
    
    cursor.execute(
        'INSERT INTO rooms (room_number, hotel_id, type, capacity) VALUES (?, ?, ?, ?)',
        (
            request.json['room_number'],
            request.json['hotel_id'],
            request.json.get('type', 'Standard'),
            request.json.get('capacity', 1)
        )
    )
    db.commit()
    return jsonify({'id': cursor.lastrowid, 'message': 'Room added successfully'}), 201

@rooms_bp.route('/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    if not request.json:
        return jsonify({'error': 'No data provided'}), 400
    
    db = get_db()
    room = db.execute('SELECT * FROM rooms WHERE id = ?', (room_id,)).fetchone()
    if room is None:
        return jsonify({'error': 'Room not found'}), 404
    
    # Check if hotel exists if hotel_id is provided
    if 'hotel_id' in request.json:
        hotel = db.execute('SELECT id FROM hotels WHERE id = ?', (request.json['hotel_id'],)).fetchone()
        if hotel is None:
            return jsonify({'error': 'Hotel not found'}), 404
    
    room_number = request.json.get('room_number', room['room_number'])
    hotel_id = request.json.get('hotel_id', room['hotel_id'])
    room_type = request.json.get('type', room['type'])
    capacity = request.json.get('capacity', room['capacity'])
    
    db.execute(
        'UPDATE rooms SET room_number = ?, hotel_id = ?, type = ?, capacity = ? WHERE id = ?',
        (room_number, hotel_id, room_type, capacity, room_id)
    )
    db.commit()
    return jsonify({'message': 'Room updated successfully'})

@rooms_bp.route('/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    db = get_db()
    db.execute('DELETE FROM rooms WHERE id = ?', (room_id,))
    db.commit()
    return jsonify({'message': 'Room deleted successfully'})

@rooms_bp.route('/by-hotel/<int:hotel_id>', methods=['GET'])
def get_rooms_by_hotel(hotel_id):
    db = get_db()
    rooms = db.execute('SELECT * FROM rooms WHERE hotel_id = ?', (hotel_id,)).fetchall()
    return jsonify([dict(row) for row in rooms])

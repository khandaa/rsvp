from flask import Blueprint, request, jsonify
from database import get_db

hotels_bp = Blueprint('hotels', __name__)

@hotels_bp.route('/', methods=['GET'])
def get_hotels():
    db = get_db()
    hotels = db.execute('SELECT * FROM hotels').fetchall()
    return jsonify([dict(row) for row in hotels])

@hotels_bp.route('/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    db = get_db()
    hotel = db.execute('SELECT * FROM hotels WHERE id = ?', (hotel_id,)).fetchone()
    if hotel is None:
        return jsonify({'error': 'Hotel not found'}), 404
    return jsonify(dict(hotel))

@hotels_bp.route('/', methods=['POST'])
def add_hotel():
    if not request.json or not 'name' in request.json:
        return jsonify({'error': 'Name is required'}), 400
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO hotels (name, address, contact_info) VALUES (?, ?, ?)',
        (request.json['name'], request.json.get('address', ''), request.json.get('contact_info', ''))
    )
    db.commit()
    return jsonify({'id': cursor.lastrowid, 'message': 'Hotel added successfully'}), 201

@hotels_bp.route('/<int:hotel_id>', methods=['PUT'])
def update_hotel(hotel_id):
    if not request.json:
        return jsonify({'error': 'No data provided'}), 400
    
    db = get_db()
    hotel = db.execute('SELECT * FROM hotels WHERE id = ?', (hotel_id,)).fetchone()
    if hotel is None:
        return jsonify({'error': 'Hotel not found'}), 404
    
    name = request.json.get('name', hotel['name'])
    address = request.json.get('address', hotel['address'])
    contact_info = request.json.get('contact_info', hotel['contact_info'])
    
    db.execute(
        'UPDATE hotels SET name = ?, address = ?, contact_info = ? WHERE id = ?',
        (name, address, contact_info, hotel_id)
    )
    db.commit()
    return jsonify({'message': 'Hotel updated successfully'})

@hotels_bp.route('/<int:hotel_id>', methods=['DELETE'])
def delete_hotel(hotel_id):
    db = get_db()
    db.execute('DELETE FROM hotels WHERE id = ?', (hotel_id,))
    db.commit()
    return jsonify({'message': 'Hotel deleted successfully'})

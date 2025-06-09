# backend/routes/logistics.py
from flask import Blueprint, request, jsonify
from database import get_db

logistics_bp = Blueprint('logistics', __name__, url_prefix='/api/logistics')

# Get all logistics
@logistics_bp.route('/', methods=['GET'])
def get_logistics():
    db = get_db()
    logistics = db.execute('SELECT * FROM logistics').fetchall()
    return jsonify([dict(row) for row in logistics])

# Add a new logistics item
@logistics_bp.route('/', methods=['POST'])
def add_logistics():
    data = request.get_json()
    db = get_db()
    db.execute('INSERT INTO logistics (name, type, status, notes) VALUES (?, ?, ?, ?)', (data['name'], data['type'], data.get('status'), data.get('notes')))
    db.commit()
    return jsonify({'message': 'Logistics item added'}), 201

# Update a logistics item
@logistics_bp.route('/<int:logistics_id>', methods=['PUT'])
def update_logistics(logistics_id):
    data = request.get_json()
    db = get_db()
    db.execute('UPDATE logistics SET name = ?, type = ?, status = ?, notes = ? WHERE id = ?', (data['name'], data['type'], data.get('status'), data.get('notes'), logistics_id))
    db.commit()
    return jsonify({'message': 'Logistics item updated'})

# Delete a logistics item
@logistics_bp.route('/<int:logistics_id>', methods=['DELETE'])
def delete_logistics(logistics_id):
    db = get_db()
    db.execute('DELETE FROM logistics WHERE id = ?', (logistics_id,))
    db.commit()
    return jsonify({'message': 'Logistics item deleted'})

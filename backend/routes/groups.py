# backend/routes/groups.py
from flask import Blueprint, request, jsonify
from database import get_db

groups_bp = Blueprint('groups', __name__, url_prefix='/api/groups')

# Get all groups
@groups_bp.route('/', methods=['GET'])
def get_groups():
    db = get_db()
    groups = db.execute('SELECT * FROM groups').fetchall()
    return jsonify([dict(row) for row in groups])

# Add a new group
@groups_bp.route('/', methods=['POST'])
def add_group():
    data = request.get_json()
    db = get_db()
    db.execute('INSERT INTO groups (name, description) VALUES (?, ?)', (data['name'], data.get('description')))
    db.commit()
    return jsonify({'message': 'Group added'}), 201

# Update a group
@groups_bp.route('/<int:group_id>', methods=['PUT'])
def update_group(group_id):
    data = request.get_json()
    db = get_db()
    db.execute('UPDATE groups SET name = ?, description = ? WHERE id = ?', (data['name'], data.get('description'), group_id))
    db.commit()
    return jsonify({'message': 'Group updated'})

# Delete a group
@groups_bp.route('/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    db = get_db()
    db.execute('DELETE FROM groups WHERE id = ?', (group_id,))
    db.commit()
    return jsonify({'message': 'Group deleted'})

# Assign guest to group
@groups_bp.route('/assign', methods=['POST'])
def assign_guest_to_group():
    data = request.get_json()
    db = get_db()
    db.execute('UPDATE guests SET group_id = ? WHERE id = ?', (data['group_id'], data['guest_id']))
    db.commit()
    return jsonify({'message': 'Guest assigned to group'})

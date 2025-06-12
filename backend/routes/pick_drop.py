# backend/routes/pick_drop.py
from flask import Blueprint, request, jsonify
from database import get_db

pick_drop_bp = Blueprint('pick_drop', __name__, url_prefix='/api/logistics/pickup')

# Get all pickup assignments
@pick_drop_bp.route('/', methods=['GET'])
def get_pickup_assignments():
    db = get_db()
    
    # Get query parameters for filtering
    pickup_status = request.args.get('pickup_status')
    search_query = request.args.get('search')
    
    # Build the base query
    query = '''
        SELECT p.*, g.name as guest_name, g.phone as guest_contact, 
        d.name as driver_name, d.phone as driver_phone
        FROM pick_drop p
        JOIN guests g ON p.guest_id = g.id
        LEFT JOIN drivers d ON p.driver_id = d.id
    '''
    params = []
    
    # Add filters if provided
    if pickup_status:
        query += ' WHERE p.pickup_status = ?'
        params.append(pickup_status)
        
        if search_query:
            query += ' AND g.name LIKE ?'
            params.append(f'%{search_query}%')
    elif search_query:
        query += ' WHERE g.name LIKE ?'
        params.append(f'%{search_query}%')
        
    query += ' ORDER BY p.pickup_time ASC'
    
    pickup_assignments = db.execute(query, params).fetchall()
    return jsonify([dict(row) for row in pickup_assignments])

# Get a specific pickup assignment
@pick_drop_bp.route('/<int:pickup_id>', methods=['GET'])
def get_pickup_assignment(pickup_id):
    db = get_db()
    pickup = db.execute('''
        SELECT p.*, g.name as guest_name, g.phone as guest_contact, 
        d.name as driver_name, d.phone as driver_phone
        FROM pick_drop p
        JOIN guests g ON p.guest_id = g.id
        LEFT JOIN drivers d ON p.driver_id = d.id
        WHERE p.id = ?
    ''', (pickup_id,)).fetchone()
    
    if pickup is None:
        return jsonify({'error': 'Pickup assignment not found'}), 404
    
    return jsonify(dict(pickup))

# Create a new pickup assignment
@pick_drop_bp.route('/', methods=['POST'])
def create_pickup_assignment():
    data = request.get_json()
    db = get_db()
    
    # Validate required fields
    if 'guest_id' not in data:
        return jsonify({'error': 'Guest ID is required'}), 400
        
    # Check if assignment already exists for this guest
    existing = db.execute('SELECT id FROM pick_drop WHERE guest_id = ?', 
                        (data['guest_id'],)).fetchone()
    
    if existing:
        # Update existing record instead
        query = '''
            UPDATE pick_drop SET 
            driver_id = ?,
            pickup_status = ?,
            car_number = ?,
            pickup_time = ?,
            dropoff_time = ?,
            pickup_location = ?,
            dropoff_location = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE guest_id = ?
        '''
        db.execute(query, (
            data.get('driver_id'),
            data.get('pickup_status', 'not_assigned'),
            data.get('car_number'),
            data.get('pickup_time'),
            data.get('dropoff_time'),
            data.get('pickup_location'),
            data.get('dropoff_location'),
            data['guest_id']
        ))
        db.commit()
        return jsonify({'message': 'Pickup assignment updated', 'id': existing['id']}), 200
    
    # Create new record
    query = '''
        INSERT INTO pick_drop (
            guest_id, driver_id, pickup_status, car_number, 
            pickup_time, dropoff_time, pickup_location, dropoff_location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    '''
    
    cursor = db.execute(query, (
        data['guest_id'],
        data.get('driver_id'),
        data.get('pickup_status', 'not_assigned'),
        data.get('car_number'),
        data.get('pickup_time'),
        data.get('dropoff_time'),
        data.get('pickup_location'),
        data.get('dropoff_location')
    ))
    db.commit()
    
    return jsonify({'message': 'Pickup assignment created', 'id': cursor.lastrowid}), 201

# Update a pickup assignment
@pick_drop_bp.route('/<int:pickup_id>', methods=['PUT'])
def update_pickup_assignment(pickup_id):
    data = request.get_json()
    db = get_db()
    
    # Check if assignment exists
    existing = db.execute('SELECT id FROM pick_drop WHERE id = ?', (pickup_id,)).fetchone()
    if not existing:
        return jsonify({'error': 'Pickup assignment not found'}), 404
    
    # Update the record
    query = '''
        UPDATE pick_drop SET 
        guest_id = ?,
        driver_id = ?,
        pickup_status = ?,
        car_number = ?,
        pickup_time = ?,
        dropoff_time = ?,
        pickup_location = ?,
        dropoff_location = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    '''
    
    db.execute(query, (
        data.get('guest_id'),
        data.get('driver_id'),
        data.get('pickup_status'),
        data.get('car_number'),
        data.get('pickup_time'),
        data.get('dropoff_time'),
        data.get('pickup_location'),
        data.get('dropoff_location'),
        pickup_id
    ))
    db.commit()
    
    return jsonify({'message': 'Pickup assignment updated'})

# Delete a pickup assignment
@pick_drop_bp.route('/<int:pickup_id>', methods=['DELETE'])
def delete_pickup_assignment(pickup_id):
    db = get_db()
    db.execute('DELETE FROM pick_drop WHERE id = ?', (pickup_id,))
    db.commit()
    return jsonify({'message': 'Pickup assignment deleted'})

# Get available drivers
@pick_drop_bp.route('/drivers', methods=['GET'])
def get_drivers():
    db = get_db()
    drivers = db.execute('SELECT * FROM drivers WHERE status = "available"').fetchall()
    return jsonify([dict(row) for row in drivers])

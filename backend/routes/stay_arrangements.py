# backend/routes/stay_arrangements.py
from flask import Blueprint, request, jsonify
from database import get_db

stay_arrangements_bp = Blueprint('stay_arrangements', __name__, url_prefix='/api/logistics/stay')

# Get all stay arrangements
@stay_arrangements_bp.route('/', methods=['GET'])
def get_stay_arrangements():
    db = get_db()
    
    # Get query parameters for filtering
    room_status = request.args.get('room_status')
    id_status = request.args.get('id_status')
    search_query = request.args.get('search')
    
    # Build the base query
    query = '''
        SELECT s.*, g.name as guest_name, g.phone as guest_contact
        FROM stay_arrangements s
        JOIN guests g ON s.guest_id = g.id
    '''
    params = []
    
    # Add filters if provided
    where_clauses = []
    
    if room_status:
        where_clauses.append('s.room_status = ?')
        params.append(room_status)
        
    if id_status:
        where_clauses.append('s.id_status = ?')
        params.append(id_status)
        
    if search_query:
        where_clauses.append('g.name LIKE ?')
        params.append(f'%{search_query}%')
    
    if where_clauses:
        query += ' WHERE ' + ' AND '.join(where_clauses)
        
    query += ' ORDER BY s.hotel_name, s.room_number'
    
    arrangements = db.execute(query, params).fetchall()
    return jsonify([dict(row) for row in arrangements])

# Get a specific stay arrangement
@stay_arrangements_bp.route('/<int:arrangement_id>', methods=['GET'])
def get_stay_arrangement(arrangement_id):
    db = get_db()
    arrangement = db.execute('''
        SELECT s.*, g.name as guest_name, g.phone as guest_contact
        FROM stay_arrangements s
        JOIN guests g ON s.guest_id = g.id
        WHERE s.id = ?
    ''', (arrangement_id,)).fetchone()
    
    if arrangement is None:
        return jsonify({'error': 'Stay arrangement not found'}), 404
    
    return jsonify(dict(arrangement))

# Create a new stay arrangement
@stay_arrangements_bp.route('/', methods=['POST'])
def create_stay_arrangement():
    data = request.get_json()
    db = get_db()
    
    # Validate required fields
    if 'guest_id' not in data:
        return jsonify({'error': 'Guest ID is required'}), 400
        
    # Check if arrangement already exists for this guest
    existing = db.execute('SELECT id FROM stay_arrangements WHERE guest_id = ?', 
                        (data['guest_id'],)).fetchone()
    
    if existing:
        # Update existing record instead
        query = '''
            UPDATE stay_arrangements SET 
            hotel_name = ?,
            room_number = ?,
            room_status = ?,
            id_status = ?,
            remarks = ?,
            check_in_date = ?,
            check_out_date = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE guest_id = ?
        '''
        db.execute(query, (
            data.get('hotel_name'),
            data.get('room_number'),
            data.get('room_status', 'not_confirmed'),
            data.get('id_status', 'not_submitted'),
            data.get('remarks'),
            data.get('check_in_date'),
            data.get('check_out_date'),
            data['guest_id']
        ))
        db.commit()
        return jsonify({'message': 'Stay arrangement updated', 'id': existing['id']}), 200
    
    # Create new record
    query = '''
        INSERT INTO stay_arrangements (
            guest_id, hotel_name, room_number, room_status,
            id_status, remarks, check_in_date, check_out_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    '''
    
    cursor = db.execute(query, (
        data['guest_id'],
        data.get('hotel_name'),
        data.get('room_number'),
        data.get('room_status', 'not_confirmed'),
        data.get('id_status', 'not_submitted'),
        data.get('remarks'),
        data.get('check_in_date'),
        data.get('check_out_date')
    ))
    db.commit()
    
    return jsonify({'message': 'Stay arrangement created', 'id': cursor.lastrowid}), 201

# Update a stay arrangement
@stay_arrangements_bp.route('/<int:arrangement_id>', methods=['PUT'])
def update_stay_arrangement(arrangement_id):
    data = request.get_json()
    db = get_db()
    
    # Check if arrangement exists
    existing = db.execute('SELECT id FROM stay_arrangements WHERE id = ?', (arrangement_id,)).fetchone()
    if not existing:
        return jsonify({'error': 'Stay arrangement not found'}), 404
    
    # Update the record
    query = '''
        UPDATE stay_arrangements SET 
        guest_id = ?,
        hotel_name = ?,
        room_number = ?,
        room_status = ?,
        id_status = ?,
        remarks = ?,
        check_in_date = ?,
        check_out_date = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    '''
    
    db.execute(query, (
        data.get('guest_id'),
        data.get('hotel_name'),
        data.get('room_number'),
        data.get('room_status'),
        data.get('id_status'),
        data.get('remarks'),
        data.get('check_in_date'),
        data.get('check_out_date'),
        arrangement_id
    ))
    db.commit()
    
    return jsonify({'message': 'Stay arrangement updated'})

# Delete a stay arrangement
@stay_arrangements_bp.route('/<int:arrangement_id>', methods=['DELETE'])
def delete_stay_arrangement(arrangement_id):
    db = get_db()
    db.execute('DELETE FROM stay_arrangements WHERE id = ?', (arrangement_id,))
    db.commit()
    return jsonify({'message': 'Stay arrangement deleted'})

from flask import Blueprint, request, jsonify, current_app
from database import get_db
import sqlite3
import uuid
import hashlib
import datetime
import jwt
from functools import wraps

users_bp = Blueprint('users', __name__)

def hash_password(password, salt=None):
    """Hash the password with a salt for storage."""
    if salt is None:
        salt = uuid.uuid4().hex
    hashed = hashlib.sha512((password + salt).encode()).hexdigest()
    return f"{salt}${hashed}"

def check_password(stored_password, provided_password):
    """Verify a password against its stored hash."""
    salt, hashed = stored_password.split('$')
    return hashed == hashlib.sha512((provided_password + salt).encode()).hexdigest()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            db = get_db()
            cursor = db.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (data['user_id'],))
            current_user = cursor.fetchone()
            if current_user is None:
                return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@users_bp.route('/', methods=['GET'])
@token_required
def get_all_users(current_user):
    """Get all users (admin only)"""
    try:
        # Check if user is admin
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized access!'}), 403
            
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT id, username, email, phone, role, created_at FROM users')
        users = cursor.fetchall()
        
        result = []
        for user in users:
            user_data = {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'phone': user['phone'],
                'role': user['role'],
                'created_at': user['created_at']
            }
            result.append(user_data)
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': 'Error getting users', 'error': str(e)}), 500

@users_bp.route('/register', methods=['POST', 'OPTIONS'])
def register_user():
    """Register a new user"""
    # Handle preflight OPTIONS request explicitly
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request accepted'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided or invalid JSON format'}), 400
            
        # Validate input
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Missing required field: {field}'}), 400
        
        # Check if username or email already exists
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? OR email = ?', 
                      (data['username'], data['email']))
        user = cursor.fetchone()
        
        if user:
            return jsonify({'message': 'Username or email already exists!'}), 409
        
        # Hash the password
        hashed_password = hash_password(data['password'])
        
        # Set default role to 'user'
        role = 'user'
        # First user is automatically an admin
        cursor.execute('SELECT COUNT(*) as count FROM users')
        count = cursor.fetchone()['count']
        if count == 0:
            role = 'admin'
        
        # Insert the new user
        cursor.execute('''
            INSERT INTO users (username, email, phone, password, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['username'], 
            data['email'], 
            data.get('phone', ''), 
            hashed_password,
            role,
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        db.commit()
        
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        return jsonify({'message': 'Error registering user', 'error': str(e)}), 500

@users_bp.route('/login', methods=['POST'])
def login_user():
    """Login a user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password!'}), 400
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        user = cursor.fetchone()
        
        if not user or not check_password(user['password'], data['password']):
            return jsonify({'message': 'Invalid email or password!'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
    except Exception as e:
        return jsonify({'message': 'Error logging in', 'error': str(e)}), 500

@users_bp.route('/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    """Get the current user's profile"""
    try:
        user_data = {
            'id': current_user['id'],
            'username': current_user['username'],
            'email': current_user['email'],
            'phone': current_user['phone'],
            'role': current_user['role'],
            'created_at': current_user['created_at']
        }
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({'message': 'Error getting user profile', 'error': str(e)}), 500

@users_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    """Request a password reset"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'message': 'Missing email!'}), 400
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        user = cursor.fetchone()
        
        if not user:
            # Always return 200 to prevent user enumeration
            return jsonify({'message': 'If your email is registered, you will receive a password reset link.'}), 200
        
        # Generate password reset token
        reset_token = str(uuid.uuid4())
        expiry = datetime.datetime.now() + datetime.timedelta(hours=1)
        
        # Store token in the database
        cursor.execute('''
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (?, ?, ?)
        ''', (user['id'], reset_token, expiry.strftime("%Y-%m-%d %H:%M:%S")))
        db.commit()
        
        # In a real application, send an email with reset link
        # For now, we'll just return the token
        return jsonify({
            'message': 'If your email is registered, you will receive a password reset link.',
            'debug_reset_token': reset_token  # This would be removed in production
        }), 200
    except Exception as e:
        return jsonify({'message': 'Error requesting password reset', 'error': str(e)}), 500

@users_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token"""
    try:
        data = request.get_json()
        
        if not data or not data.get('token') or not data.get('new_password'):
            return jsonify({'message': 'Missing token or new password!'}), 400
        
        db = get_db()
        cursor = db.cursor()
        
        # Verify the token
        cursor.execute('''
            SELECT * FROM password_reset_tokens 
            WHERE token = ? AND expires_at > ? AND used = 0
        ''', (data['token'], datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        token_record = cursor.fetchone()
        
        if not token_record:
            return jsonify({'message': 'Invalid or expired token!'}), 401
        
        # Hash the new password
        hashed_password = hash_password(data['new_password'])
        
        # Update the password
        cursor.execute('UPDATE users SET password = ? WHERE id = ?', 
                      (hashed_password, token_record['user_id']))
        
        # Mark the token as used
        cursor.execute('UPDATE password_reset_tokens SET used = 1 WHERE token = ?', 
                      (data['token'],))
        
        db.commit()
        
        return jsonify({'message': 'Password reset successful!'}), 200
    except Exception as e:
        return jsonify({'message': 'Error resetting password', 'error': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
    """Update a user (admin or self only)"""
    try:
        # Check if user is updating self or is admin
        if current_user['id'] != user_id and current_user['role'] != 'admin':
            return jsonify({'message': 'Unauthorized access!'}), 403
            
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided!'}), 400
            
        db = get_db()
        cursor = db.cursor()
        
        # Get the current user data
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'User not found!'}), 404
            
        # Update fields
        updates = []
        params = []
        
        if 'username' in data:
            updates.append('username = ?')
            params.append(data['username'])
            
        if 'email' in data:
            updates.append('email = ?')
            params.append(data['email'])
            
        if 'phone' in data:
            updates.append('phone = ?')
            params.append(data['phone'])
            
        # Only admin can change roles
        if 'role' in data and current_user['role'] == 'admin':
            updates.append('role = ?')
            params.append(data['role'])
            
        if not updates:
            return jsonify({'message': 'No valid fields to update!'}), 400
            
        # Add the user_id to params
        params.append(user_id)
        
        # Execute the update
        cursor.execute(f'''
            UPDATE users SET {', '.join(updates)}
            WHERE id = ?
        ''', tuple(params))
        db.commit()
        
        return jsonify({'message': 'User updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': 'Error updating user', 'error': str(e)}), 500

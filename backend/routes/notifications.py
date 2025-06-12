# backend/routes/notifications.py
from flask import Blueprint, request, jsonify
import os
from datetime import datetime
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

# In-memory placeholder for notifications
notifications_db = []

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    event_id = request.args.get('event_id')
    
    # Filter notifications based on event_id if provided
    if event_id:
        filtered_notifications = [n for n in notifications_db if n.get('eventId') == event_id]
    else:
        filtered_notifications = notifications_db
    
    return jsonify(filtered_notifications)

@notifications_bp.route('/send', methods=['POST'])
@jwt_required()
def send_notification():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Extract data from request
    notification_type = data.get('type', 'whatsapp')  # Default to WhatsApp
    message = data.get('message')
    recipient_ids = data.get('recipientIds', [])
    group_ids = data.get('groupIds', [])
    scheduled_time = data.get('scheduled_time')
    event_id = data.get('eventId')
    
    if not message:
        return jsonify({'error': 'Message content is required'}), 400
    
    if not recipient_ids and not group_ids:
        return jsonify({'error': 'At least one recipient or group must be specified'}), 400
    
    # Create notification object
    notification = {
        'id': str(uuid.uuid4()),
        'type': notification_type,
        'message': message,
        'recipientIds': recipient_ids,
        'groupIds': group_ids,
        'recipient_count': len(recipient_ids),
        'group_count': len(group_ids),
        'eventId': event_id,
        'userId': user_id,
        'status': 'scheduled' if scheduled_time else 'sent',
        'scheduled_time': scheduled_time,
        'sent_at': None if scheduled_time else datetime.utcnow().isoformat(),
        'created_at': datetime.utcnow().isoformat()
    }
    
    # In a real implementation, here you would:
    # 1. Save notification to database
    # 2. Queue for immediate sending or schedule for later
    # 3. If WhatsApp, call WhatsApp API
    # 4. Track delivery status
    
    # For this implementation, we'll just store it in memory
    notifications_db.append(notification)
    
    # For WhatsApp notifications, we'd integrate with WhatsApp Business API
    if notification_type == 'whatsapp':
        # Simulate WhatsApp sending
        if not scheduled_time:
            notification['status'] = 'sent'
            # In a real app, we'd call the WhatsApp API here
            # e.g., whatsapp_api.send_message(recipients, message)
    
    return jsonify({
        'message': 'Notification scheduled' if scheduled_time else 'Notification sent',
        'notification': notification
    })

@notifications_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_notification_templates():
    """Get predefined notification templates"""
    # In a real app, these would come from a database
    templates = [
        {
            'id': '1',
            'name': 'RSVP Reminder',
            'content': 'Hi [NAME], please remember to RSVP for our wedding by [DATE]. We look forward to celebrating with you!',
            'type': 'whatsapp'
        },
        {
            'id': '2',
            'name': 'Event Details Update',
            'content': 'Hi [NAME], we have updated the details for our wedding. Please check the website for the latest information.',
            'type': 'whatsapp'
        },
        {
            'id': '3',
            'name': 'Thank You',
            'content': 'Hi [NAME], thank you for attending our wedding! We hope you had a great time.',
            'type': 'whatsapp'
        }
    ]
    
    return jsonify(templates)

@notifications_bp.route('/<notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Delete a notification"""
    global notifications_db
    
    # Find and remove the notification
    for i, notification in enumerate(notifications_db):
        if notification.get('id') == notification_id:
            del notifications_db[i]
            return jsonify({'message': 'Notification deleted'})
    
    return jsonify({'error': 'Notification not found'}), 404

# backend/routes/notifications.py
from flask import Blueprint, request, jsonify
import os
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

# In-memory placeholder for scheduled notifications
scheduled_notifications = []

@notifications_bp.route('/', methods=['GET'])
def get_notifications():
    # Return all scheduled and sent notifications (placeholder)
    return jsonify(scheduled_notifications)

@notifications_bp.route('/send', methods=['POST'])
def send_notification():
    data = request.get_json()
    notification = {
        'type': data.get('type'),
        'recipient': data.get('recipient'),
        'group': data.get('group'),
        'message': data.get('message'),
        'scheduled_time': data.get('scheduled_time'),
        'status': 'scheduled' if data.get('scheduled_time') else 'sent',
        'created_at': datetime.utcnow().isoformat()
    }
    scheduled_notifications.append(notification)
    return jsonify({'message': 'Notification scheduled' if data.get('scheduled_time') else 'Notification sent', 'notification': notification})

@notifications_bp.route('/send/bulk', methods=['POST'])
def send_bulk_notification():
    data = request.get_json()
    recipients = data.get('recipients', [])
    group = data.get('group')
    message = data.get('message')
    scheduled_time = data.get('scheduled_time')
    notifications = []
    for recipient in recipients:
        notification = {
            'type': data.get('type'),
            'recipient': recipient,
            'group': group,
            'message': message,
            'scheduled_time': scheduled_time,
            'status': 'scheduled' if scheduled_time else 'sent',
            'created_at': datetime.utcnow().isoformat()
        }
        scheduled_notifications.append(notification)
        notifications.append(notification)
    return jsonify({'message': 'Bulk notifications scheduled' if scheduled_time else 'Bulk notifications sent', 'notifications': notifications})

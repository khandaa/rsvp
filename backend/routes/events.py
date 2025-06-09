# backend/routes/events.py
from flask import Blueprint, request, jsonify

events_bp = Blueprint('events', __name__, url_prefix='/api/events')

# In-memory placeholder for events and assignments
EVENTS = []
EVENT_GUESTS = {}  # event_id: [guest_ids]
EVENT_GROUPS = {}  # event_id: [group_ids]

@events_bp.route('/', methods=['GET'])
def get_events():
    return jsonify(EVENTS)

@events_bp.route('/', methods=['POST'])
def add_event():
    data = request.get_json()
    event = {
        'id': len(EVENTS) + 1,
        'name': data.get('name'),
        'date': data.get('date'),
        'location': data.get('location'),
        'description': data.get('description'),
    }
    EVENTS.append(event)
    return jsonify(event)

@events_bp.route('/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    for event in EVENTS:
        if event['id'] == event_id:
            event.update(data)
            return jsonify(event)
    return jsonify({'error': 'Event not found'}), 404

@events_bp.route('/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    global EVENTS
    EVENTS = [e for e in EVENTS if e['id'] != event_id]
    return jsonify({'message': 'Event deleted'})

# Assign guests or groups to an event
@events_bp.route('/<int:event_id>/assign', methods=['POST'])
def assign_to_event(event_id):
    data = request.get_json()
    guest_ids = data.get('guest_ids', [])
    group_ids = data.get('group_ids', [])
    if guest_ids:
        EVENT_GUESTS.setdefault(event_id, []).extend(guest_ids)
    if group_ids:
        EVENT_GROUPS.setdefault(event_id, []).extend(group_ids)
    return jsonify({'event_id': event_id, 'guest_ids': EVENT_GUESTS.get(event_id, []), 'group_ids': EVENT_GROUPS.get(event_id, [])})

# Get guests/groups assigned to an event
@events_bp.route('/<int:event_id>/assignments', methods=['GET'])
def get_event_assignments(event_id):
    return jsonify({'guest_ids': EVENT_GUESTS.get(event_id, []), 'group_ids': EVENT_GROUPS.get(event_id, [])})

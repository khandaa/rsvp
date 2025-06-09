# backend/routes/chatbot.py
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

# FAQ endpoint (static for now)
@chatbot_bp.route('/faq', methods=['GET'])
def get_faq():
    faqs = [
        {'question': 'How do I RSVP?', 'answer': 'Use your personalized RSVP link sent via email or WhatsApp.'},
        {'question': 'Can I bring a plus one?', 'answer': 'Check your invitation details or contact the event organizer.'},
        {'question': 'What is the dress code?', 'answer': 'See your invitation for dress code information.'}
    ]
    return jsonify(faqs)

# Placeholder for chatbot Q&A (to be enhanced with AI later)
@chatbot_bp.route('/ask', methods=['POST'])
def ask_chatbot():
    data = request.get_json()
    question = data.get('question', '')
    # Simple static response for now
    return jsonify({'answer': 'This is a placeholder response. Please check the FAQ or contact support.'})

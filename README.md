# RSVP Event Application

A full-stack web application for managing wedding RSVPs, guests, groups, events, logistics, notifications, and reporting dashboards. Built with React (frontend) and Flask (backend), supporting secure RSVP links and WhatsApp integration.

## Features
- Guest management (CRUD, bulk import, search/filter)
- Group management (CRUD, assign guests)
- RSVP dashboard and secure RSVP links
- Event management (CRUD)
- Logistics management (CRUD)
- Notifications (Email, SMS, WhatsApp)
- Chatbot/FAQ
- WhatsApp messaging
- Reporting dashboards
- Admin dashboard and default admin credentials: `admin/admin`

## Tech Stack
- Frontend: React, Material UI, Bootstrap
- Backend: Flask, Flask-CORS, psycopg2-binary
- Database: PostgreSQL

## Setup
1. Clone the repo and install dependencies in `frontend/` and `backend/`.
2. Configure `.env` files as per `.env.example`.
3. Start backend (`flask --app app run`) and frontend (`npm start`).
4. Access the app at `http://localhost:3000`.

## Testing
- Run unit/integration tests in `frontend/src/components` and `backend/tests`.
- End-to-end test skeletons in `test/`.

## Documentation
- See `docs/help.md`, architecture and flow diagrams.

## Versioning
- Semantic versioning is used. See `CHANGELOG.md` for release history.

---
_Last updated: 2025-06-09_

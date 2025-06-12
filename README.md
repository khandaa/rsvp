# RSVP Event Application

A full-stack web application for managing wedding RSVPs, guests, groups, events, logistics, notifications, and reporting dashboards. Built with React (frontend) and Flask (backend), supporting secure RSVP links and WhatsApp integration.

## Features
- User Authentication & Authorization
  - Registration and Login with JWT-based authentication
  - Password reset functionality
  - Role-based access control with separate admin and user views
  - Secure token storage and validation
- User Dashboard
  - Personalized view of events and statistics
  - Responsive design for mobile and desktop
  - Quick access to primary functions
- Guest Management
  - CRUD operations for individual guests
  - Bulk import from CSV/Excel
  - Advanced search and filtering
- Group Management
  - Create and manage guest groups
  - Assign/remove guests from groups
  - Group statistics and reporting
- RSVP Management
  - Secure personalized RSVP links
  - Status tracking and statistics
  - Response management
- Notification System
  - **Enhanced! Multi-recipient messaging to individuals and groups**
  - **WhatsApp integration as primary notification channel**
  - Email and SMS alternatives
  - **Message template support**
  - Scheduled notifications
  - Notification history tracking
- Admin Dashboard
  - Comprehensive event overview
  - User management
  - Default admin credentials: `admin/admin`
  - System configuration options

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

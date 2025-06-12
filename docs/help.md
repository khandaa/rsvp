# RSVP Event Application Help

## Overview
This application helps event managers handle wedding RSVPs, guests, groups, event schedules, logistics, notifications, and reporting dashboards. It includes admin and user-facing modules, secure RSVP links, and enhanced WhatsApp integration for notifications.

## Features

### Authentication System
- **User Registration**: Create an account with email, username, and password
- **Login**: Secure JWT-based authentication
- **Password Reset**: Self-service password recovery via email
- **Role-based Access**: Different views and permissions for admins and regular users

### User Dashboard
- Personalized event view
- Event statistics and summaries
- Quick access to key functions
- Responsive design for all devices

### Guest Management
- Add, edit, delete individual guests
- Bulk import from CSV/Excel
- Advanced search and filtering across multiple fields
- Associate guests with groups

### Group Management
- Create and manage guest groups
- Assign/remove guests from groups
- Group statistics and reporting

### RSVP Management
- Generate secure, unique RSVP links
- Track response status
- Collect dietary requirements and plus-one information

### Enhanced Notification System
- **Multi-recipient Messaging**: Send to multiple individuals and groups at once
- **WhatsApp Integration**: Primary notification channel with direct messaging
- **Template Support**: Create and use message templates
- **Scheduled Notifications**: Set future send dates and times
- **Email and SMS Alternatives**: Multiple channel support
- **Notification History**: Track all sent messages

## Admin Functionality
- Access to all application modules and dashboards
- Guest and group management with bulk operations
- Event creation and scheduling
- Notification system management with template creation
- User management (create, edit, delete users)
- System configuration and settings
- Default credentials: `admin/admin`

## Architecture Diagram
![Architecture Diagram](architecture-diagram.png)

## Flow Diagram
![Flow Diagram](flow-diagram.png)

## Technical Details

### Frontend Structure
- React-based SPA with Material UI and Bootstrap for responsive design
- Component-based architecture with context API for state management
- JWT authentication stored in localStorage
- Organized in directories:
  - `/frontend` - All frontend code
  - `/frontend/src/components` - React components
  - `/frontend/src/context` - Context providers including AuthContext
  - `/frontend/src/api` - API utilities

### Backend Structure
- Flask backend with RESTful API endpoints
- JWT authentication using flask-jwt-extended
- SQLite database for development
- Organized in directories:
  - `/backend` - All backend code
  - `/backend/routes` - API endpoint routes
  - `/database` - Database files and utilities

## Troubleshooting

### Authentication Issues
- Make sure you're using the correct credentials
- If you're experiencing "Method Not Allowed" errors, ensure your browser isn't blocking cookies or CORS
- For password reset issues, check your email spam folder

### Notification System
- WhatsApp notifications require proper configuration in the backend
- For bulk notifications, verify that all recipients exist in the system
- Scheduled notifications will only send if the server is running at the scheduled time

### General Issues
- Clear browser cache if experiencing UI issues
- Ensure both frontend and backend servers are running
- Check for any console errors in the browser developer tools

## Getting Help
- For technical issues, contact the system administrator
- For RSVP or invitation queries, use your secure RSVP link or the chatbot/FAQ section
- Documentation can be found in the `/docs` directory

---
_Last updated: 2025-06-12_

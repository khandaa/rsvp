-- schema.sql: Initial database schema for RSVP Event Application

-- Guests table
CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    group_id INTEGER,
    rsvp_status VARCHAR(20) DEFAULT 'no_response',
    rsvp_token VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Events/Schedule table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

-- Guest-Event Assignment table
CREATE TABLE guest_events (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id),
    event_id INTEGER REFERENCES events(id)
);

-- Logistics table
CREATE TABLE logistics (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id),
    travel_mode VARCHAR(50),
    arrival_time TIMESTAMP,
    stay_details TEXT,
    pick_drop_details TEXT
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id),
    message TEXT,
    sent_at TIMESTAMP
);

-- RSVP Secure Link Index
CREATE INDEX idx_guests_rsvp_token ON guests(rsvp_token);

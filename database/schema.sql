-- schema.sql: Initial database schema for RSVP Event Application

-- Guests table
CREATE TABLE guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    group_id INTEGER,
    wedding_id INTEGER,
    rsvp_status VARCHAR(20) DEFAULT 'no_response',
    rsvp_token VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Weddings table
CREATE TABLE weddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

-- Events/Schedule table
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

-- Guest-Event Assignment table
CREATE TABLE guest_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    event_id INTEGER REFERENCES events(id)
);

-- Logistics table
CREATE TABLE logistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    travel_mode VARCHAR(50),
    arrival_time TIMESTAMP,
    stay_details TEXT,
    pick_drop_details TEXT
);

-- Notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    message TEXT,
    sent_at TIMESTAMP
);

-- RSVPs table
CREATE TABLE rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    status VARCHAR(20) NOT NULL
);

-- RSVP Secure Link Index
CREATE INDEX idx_guests_rsvp_token ON guests(rsvp_token);

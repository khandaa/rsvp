-- schema.sql: Enhanced database schema for RSVP Event Application

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
    side VARCHAR(20) DEFAULT 'neutral', -- 'bride_side', 'groom_side', 'neutral'
    dietary_preferences TEXT,
    meal_selection VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    group_type VARCHAR(50) DEFAULT 'custom' -- 'bride_side', 'groom_side', 'custom', etc.
);

-- Weddings table
CREATE TABLE weddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    hashtag VARCHAR(50) UNIQUE,
    bride_name VARCHAR(255),
    groom_name VARCHAR(255),
    location TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    arrival_mode VARCHAR(50),
    arrival_status VARCHAR(50) DEFAULT 'not_confirmed',
    departure_mode VARCHAR(50),
    departure_status VARCHAR(50) DEFAULT 'not_confirmed',
    vehicle_number VARCHAR(50),
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotel Stay Arrangements table
CREATE TABLE stay_arrangements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    hotel_name VARCHAR(255),
    room_number VARCHAR(50),
    room_status VARCHAR(50) DEFAULT 'not_confirmed',
    id_status VARCHAR(50) DEFAULT 'not_submitted',
    remarks TEXT,
    check_in_date TIMESTAMP,
    check_out_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pick & Drop table
CREATE TABLE pick_drop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    driver_id INTEGER REFERENCES drivers(id),
    pickup_status VARCHAR(50) DEFAULT 'not_assigned',
    car_number VARCHAR(50),
    pickup_time TIMESTAMP,
    dropoff_time TIMESTAMP,
    pickup_location TEXT,
    dropoff_location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    message TEXT,
    medium VARCHAR(20), -- 'email', 'whatsapp', 'sms'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    attachment_path TEXT,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Notification Templates table
CREATE TABLE notification_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default notification templates
INSERT INTO notification_templates (name, content) VALUES
('Invite guests', 'Dear {guest_name}, you are cordially invited to {wedding_name} on {wedding_date}.'),
('Request RSVP', 'Dear {guest_name}, please RSVP for {wedding_name} by clicking on this link: {rsvp_link}'),
('Get Travel Info', 'Dear {guest_name}, please share your travel details for {wedding_name}.'),
('Collect IDs', 'Dear {guest_name}, please share ID details for hotel check-in at {wedding_name}.'),
('Request Pictures', 'Dear {guest_name}, please share your pictures from {wedding_name}.'),
('Send Thanks', 'Dear {guest_name}, thank you for attending {wedding_name}.');

-- RSVPs table
CREATE TABLE rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    event_id INTEGER REFERENCES events(id),
    status VARCHAR(20) NOT NULL,
    response_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RSVP Secure Link Index
CREATE INDEX idx_guests_rsvp_token ON guests(rsvp_token);

-- schema_update.sql: Add hotels and rooms tables

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number VARCHAR(50) NOT NULL,
    hotel_id INTEGER REFERENCES hotels(id),
    type VARCHAR(50) DEFAULT 'Standard',
    capacity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create new stay_arrangements_new table with proper foreign keys
CREATE TABLE IF NOT EXISTS stay_arrangements_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER REFERENCES guests(id),
    hotel_id INTEGER REFERENCES hotels(id),
    room_id INTEGER REFERENCES rooms(id),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for hotels
INSERT INTO hotels (name, address, contact_info) VALUES 
('Grand Palace', '123 Main St, City', '+1-555-123-4567'),
('Luxury Resort', '456 Ocean Ave, Beach', '+1-555-987-6543');

-- Insert sample rooms
INSERT INTO rooms (room_number, hotel_id, type, capacity) VALUES 
('101', 1, 'Standard', 2),
('102', 1, 'Deluxe', 2),
('201', 1, 'Suite', 4),
('101', 2, 'Standard', 2),
('102', 2, 'Deluxe', 3),
('301', 2, 'Presidential Suite', 6);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_stay_arrangements_new_guest_id ON stay_arrangements_new(guest_id);
CREATE INDEX IF NOT EXISTS idx_stay_arrangements_new_hotel_id ON stay_arrangements_new(hotel_id);
CREATE INDEX IF NOT EXISTS idx_stay_arrangements_new_room_id ON stay_arrangements_new(room_id);

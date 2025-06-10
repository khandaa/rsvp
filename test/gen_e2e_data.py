import random
import sqlite3
import os

def gen_data():
    DB = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/rsvp.sqlite3'))
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    # Clean
    c.execute('DELETE FROM guests')
    c.execute('DELETE FROM groups')
    c.execute('DELETE FROM weddings')
    c.execute('DELETE FROM rsvps')
    conn.commit()
    # Weddings
    weddings = []
    for i in range(5):
        name = f"Wedding {i+1}"
        date = f"2025-07-{10+i}"
        c.execute('INSERT INTO weddings (name, date) VALUES (?, ?)', (name, date))
        weddings.append(c.lastrowid)
    # Groups
    groups = []
    for i in range(4):
        gname = f"Group {i+1}"
        c.execute('INSERT INTO groups (name) VALUES (?)', (gname,))
        groups.append(c.lastrowid)
    # Guests
    guests = []
    for i in range(20):
        w = random.choice(weddings)
        g = random.choice(groups)
        name = f"Guest {i+1}"
        email = f"guest{i+1}@example.com"
        phone = f"99900000{i+1:02d}"
        c.execute('INSERT INTO guests (name, email, phone, group_id, wedding_id) VALUES (?, ?, ?, ?, ?)', (name, email, phone, g, w))
        guests.append(c.lastrowid)
    # RSVPs (90%)
    for gid in random.sample(guests, int(0.9*len(guests))):
        c.execute('INSERT INTO rsvps (guest_id, status) VALUES (?, ?)', (gid, 'confirmed'))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    gen_data()

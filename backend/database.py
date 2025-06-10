import sqlite3
from flask import g
import os

DATABASE = os.path.join(os.path.dirname(__file__), '../database/rsvp.sqlite3')
SCHEMA = os.path.join(os.path.dirname(__file__), '../database/schema.sql')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def close_db(exception=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize the database."""
    try:
        db_dir = os.path.dirname(DATABASE)
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
            
        if not os.path.exists(DATABASE):
            with sqlite3.connect(DATABASE) as conn:
                with open(SCHEMA, 'r') as f:
                    conn.executescript(f.read())
                print(f"Database initialized at {DATABASE}")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
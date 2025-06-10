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

def init_db():
    if not os.path.exists(DATABASE):
        with sqlite3.connect(DATABASE) as conn:
            with open(SCHEMA, 'r') as f:
                conn.executescript(f.read())

def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

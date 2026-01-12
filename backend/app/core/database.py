import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from pathlib import Path

# 1. Robustly find the .env file
# We start at this file (database.py) and go up 4 levels to reach the project root
# File: backend/app/core/database.py
# Parents: core -> app -> backend -> root (aadhaar-sahayak)
env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DB_URL = os.getenv("DATABASE_URL")

# Debugging: Print this to see if it works (Remove later)
print(f"DEBUG: Loaded DB_URL: {DB_URL}")

if not DB_URL:
    raise ValueError("DATABASE_URL is not set. Check your .env file path.")

# Fix for SQLAlchemy (Neon returns 'postgres://', we need 'postgresql://')
if DB_URL and DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DB_URL)
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from pathlib import Path

# Load connection
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

db_url = os.getenv("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)

print("\n--- DIAGNOSTIC REPORT FOR LUCKNOW ---")

with engine.connect() as conn:
    # 1. Check Total Rows (Did we actually load all 12 files?)
    total_enrolment = conn.execute(text('SELECT COUNT(*) FROM "Enrolment"')).scalar()
    print(f"1. Total Rows in Enrolment Table: {total_enrolment}")
    
    if total_enrolment < 1000000:
        print("   [!] WARNING: Database seems small. Did you run the full ingest.py?")

    # 2. Check how Lucknow is spelled in the DB
    # We search for anything sounding like 'LUCK%'
    print("\n2. Searching for District spellings:")
    variants = conn.execute(text("SELECT DISTINCT district FROM \"Enrolment\" WHERE district LIKE 'LUCK%'")).fetchall()
    for v in variants:
        print(f"   Found: '{v[0]}'")

    if not variants:
        print("   [!] CRITICAL: No district starting with 'LUCK' found. Check your CSVs.")

    # 3. Check the Sum manually
    print("\n3. Manual Sum Calculation:")
    sql = text("SELECT SUM(age_0_5), SUM(age_5_17) FROM \"Enrolment\" WHERE district = 'LUCKNOW'")
    result = conn.execute(sql).fetchone()
    print(f"   Manual SQL Result: Babies={result[0]}, Students={result[1]}")

print("-------------------------------------")
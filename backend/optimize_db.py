import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
db_url = os.getenv("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)

print("--- 🚀 UPGRADING DATABASE FOR COMMAND CENTER ---")

with engine.connect() as conn:
    conn = conn.execution_options(isolation_level="AUTOCOMMIT")
    
    # 1. Drop old view
    conn.execute(text("DROP MATERIALIZED VIEW IF EXISTS dashboard_stats;"))

    # 2. Create Expanded View (Now with STATE level grouping)
    # Note: We assume your CSVs had a 'state' column. If not, we use district as state.
    print("2. Creating Command Center View...")
    
    sql_view = """
    CREATE MATERIALIZED VIEW dashboard_stats AS
    WITH 
    E_Stats AS (
        SELECT 
            state, district,
            SUM(age_0_5) as total_babies, 
            SUM(age_5_17) as total_students,
            SUM(age_18_greater) as total_adults
        FROM "Enrolment"
        GROUP BY state, district
    ),
    D_Stats AS (
        SELECT district, SUM(demo_age_17_) as migration_influx
        FROM "Demographic"
        GROUP BY district
    ),
    B_Stats AS (
        SELECT district, 
               SUM(bio_age_5_17) as bio_updates_kids,
               SUM(bio_age_17_) as bio_updates_adults
        FROM "Biometric"
        GROUP BY district
    )
    SELECT 
        E.state,
        E.district,
        COALESCE(E.total_babies, 0) as total_babies,
        COALESCE(E.total_students, 0) as total_students,
        COALESCE(E.total_adults, 0) as total_adults,
        (COALESCE(E.total_babies, 0) + COALESCE(E.total_students, 0) + COALESCE(E.total_adults, 0)) as total_enrollment,
        COALESCE(D.migration_influx, 0) as migration_influx,
        COALESCE(B.bio_updates_kids, 0) as bio_updates_kids,
        COALESCE(B.bio_updates_adults, 0) as bio_updates_adults
    FROM E_Stats E
    LEFT JOIN D_Stats D ON E.district = D.district
    LEFT JOIN B_Stats B ON E.district = B.district;
    """
    
    try:
        conn.execute(text(sql_view))
        conn.execute(text('CREATE INDEX IF NOT EXISTS idx_dash_state ON dashboard_stats (state);'))
        print("   ✅ Command Center View Created.")
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        print("   (If this failed, your tables might miss the 'state' column. Check your CSVs.)")

    print("3. Refreshing Data...")
    conn.execute(text("REFRESH MATERIALIZED VIEW dashboard_stats;"))

print("🎉 DATABASE UPGRADED.")
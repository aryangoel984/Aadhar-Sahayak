from fastapi import APIRouter
from sqlalchemy import text
from app.core.database import engine
import math

router = APIRouter()

@router.get("/cc/stats")
def get_command_center_stats():
    """Returns ALL data for the Command Center Dashboard."""
    try:
        with engine.connect() as conn:
            # 1. KPI Cards
            kpi_sql = text("""
                SELECT 
                    SUM(total_enrollment) as total,
                    SUM(total_babies) as babies,
                    SUM(total_students) as students,
                    SUM(total_adults) as adults,
                    SUM(bio_updates_kids) + SUM(bio_updates_adults) as total_updates
                FROM dashboard_stats;
            """)
            kpi = conn.execute(kpi_sql).fetchone()
            
            # 2. Geographic Intelligence (Top States)
            geo_sql = text("""
                SELECT state, SUM(total_enrollment) as val 
                FROM dashboard_stats 
                GROUP BY state 
                ORDER BY val DESC LIMIT 10;
            """)
            geo_data = [{"name": row[0], "value": row[1]} for row in conn.execute(geo_sql).fetchall()]

            # 3. Age Group Distribution (Global)
            age_dist = [
                {"name": "0-5 (Babies)", "value": kpi[1]},
                {"name": "5-17 (Students)", "value": kpi[2]},
                {"name": "18+ (Adults)", "value": kpi[3]}
            ]

            # 4. Anomaly Detection (Scatter Plot Data)
            # X = Enrollment Volume, Y = Biometric Gap
            scatter_sql = text("""
                SELECT district, total_enrollment, (total_students - bio_updates_kids) as gap
                FROM dashboard_stats
                ORDER BY total_enrollment DESC LIMIT 50;
            """)
            scatter_data = [{"name": row[0], "x": row[1], "y": row[2], "z": 1} for row in conn.execute(scatter_sql).fetchall()]

            # 5. Enrollment vs Biometric Correlation (Dual Axis)
            corr_sql = text("""
                SELECT state, 
                       SUM(total_students) as enrollment, 
                       SUM(bio_updates_kids) as updates 
                FROM dashboard_stats 
                GROUP BY state 
                ORDER BY enrollment DESC LIMIT 10;
            """)
            corr_data = [{"name": row[0], "enrollment": row[1], "updates": row[2]} for row in conn.execute(corr_sql).fetchall()]

            # 6. Auto-Generated Insights
            top_state = geo_data[0]['name'] if geo_data else "N/A"
            total_gap = (kpi[2] or 0) - (kpi[4] or 0) # Rough gap calc
            
            insights = [
                f"{top_state} contributes {(geo_data[0]['value'] / kpi[0] * 100):.1f}% of total enrollments.",
                f"Child (0-17) enrollments make up {((kpi[1]+kpi[2])/kpi[0]*100):.1f}% of the database.",
                f"Biometric Update Gap detected: ~{total_gap:,} students may have outdated biometrics."
            ]

            return {
                "kpi": {
                    "total": kpi[0],
                    "daily_avg": int(kpi[0] / 30), # Mocking 30-day period
                    "child_adult_ratio": round((kpi[1]+kpi[2]) / (kpi[3] or 1), 2),
                    "anomalies": len([x for x in scatter_data if x['y'] > 5000]) # Example threshold
                },
                "geo_data": geo_data,
                "age_dist": age_dist,
                "scatter_data": scatter_data,
                "corr_data": corr_data,
                "insights": insights
            }

    except Exception as e:
        return {"error": str(e)}
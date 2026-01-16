# Handles Database connections, LLM initialization, and Helper functions.
import os
from langchain_groq import ChatGroq
from langchain_community.utilities import SQLDatabase
from app.core.database import engine
from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy import text

# 1. Setup Environment
env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY not found in .env")

# 2. Initialize Resources
db = SQLDatabase(engine)
SCHEMA_STRING = db.get_table_info()

# Initialize Groq LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0
)

# 3. Helper Functions
def clean_sql(sql_text: str) -> str:
    """Removes markdown backticks and 'sql' labels."""
    return sql_text.replace("```sql", "").replace("```", "").strip()

def execute_sql_query(sql: str):
    """Executes the SQL and returns the result safely."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql)).fetchall()
            return str(result)
    except Exception as e:
        return f"Error executing SQL: {str(e)}"
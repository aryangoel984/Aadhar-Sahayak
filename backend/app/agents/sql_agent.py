import os
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_groq import ChatGroq
from app.core.database import engine
from dotenv import load_dotenv
from pathlib import Path

# 1. Setup
env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY not found in .env")

# 2. Database & Toolkit
# The Toolkit gives the Agent the "Power of Inspection"
db = SQLDatabase(engine)
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)
toolkit = SQLDatabaseToolkit(db=db, llm=llm)

# 3. Universal System Prompt (Principles, Not Rules)
# We teach it HOW to think, not WHAT to think.
UNIVERSAL_PROMPT = """
You are an expert Data Analyst Agent. 
Your goal is to answer user questions by querying a PostgreSQL database.

**YOUR TOOLKIT:**
1. `sql_db_list_tables`: Use this first to see what tables exist.
2. `sql_db_schema`: Use this to check column names and types. **ALWAYS check schema before assuming a column exists.**
3. `sql_db_query`: Use this to execute valid SQL.

**CORE BEHAVIORS:**
1. **Explore First:** Do not guess column names. If asked for "Pincode", check the schema to see if a 'pincode' column exists. If not, look for alternatives like 'zipcode', 'sub_district', or 'ward'.
2. **Handle Errors:** If a query fails (e.g., "column not found"), do NOT retry the same query. Use `sql_db_schema` to find the correct column name, then rewrite the query.
3. **Complex Logic:** - If asked for a "Load" or "Index" (e.g., Hunger Load), write the mathematical formula directly in the SQL: `SELECT (col_a + col_b * 0.5) as metric ...`
   - Do NOT fetch all raw data to Python. Keep the calculation in SQL.
4. **Formatting:** - Always use UPPERCASE for text filters (e.g., `district = 'JAIPUR'`).
   - Use `LIMIT 5` for top lists.

**Refusal Strategy:**
If you cannot find relevant columns after checking the schema, honestly state: "The database does not contain Pincode or location data." Do not hallucinate.
"""

# 4. Create the Universal Agent
agent_executor = create_sql_agent(
    llm=llm,
    toolkit=toolkit,            # Gives it the tools to self-correct
    agent_type="openai-tools",  # Works best for tool calling
    verbose=True,               # See its "Thought Process" in terminal
    prefix=UNIVERSAL_PROMPT,
    handle_parsing_errors=True,
    max_iterations=12           # Give it enough steps to explore -> error -> fix -> result
)

def ask_agent(query: str):
    try:
        # The agent will now autonomously explore and solve
        response = agent_executor.invoke(query)
        return response['output']
    except Exception as e:
        return f"System Error: {str(e)}"
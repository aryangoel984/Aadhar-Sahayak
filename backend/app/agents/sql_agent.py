# import os
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits import create_sql_agent
# from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_groq import ChatGroq
# from app.core.database import engine
# from dotenv import load_dotenv
# from pathlib import Path

# # 1. Setup
# env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
# load_dotenv(dotenv_path=env_path)

# if not os.getenv("GROQ_API_KEY"):
#     raise ValueError("GROQ_API_KEY not found in .env")

# # 2. Database & Toolkit
# # The Toolkit gives the Agent the "Power of Inspection"
# db = SQLDatabase(engine)
# llm = ChatGroq(
#     model="llama-3.3-70b-versatile",
#     temperature=0
# )
# toolkit = SQLDatabaseToolkit(db=db, llm=llm)

# # 3. Universal System Prompt (Principles, Not Rules)
# # We teach it HOW to think, not WHAT to think.
# UNIVERSAL_PROMPT = """
# You are an expert Data Analyst Agent. 
# Your goal is to answer user questions by querying a PostgreSQL database.

# **YOUR TOOLKIT:**
# 1. `sql_db_list_tables`: Use this first to see what tables exist.
# 2. `sql_db_schema`: Use this to check column names and types. **ALWAYS check schema before assuming a column exists.**
# 3. `sql_db_query`: Use this to execute valid SQL.

# **CORE BEHAVIORS:**
# 1. **Explore First:** Do not guess column names. If asked for "Pincode", check the schema to see if a 'pincode' column exists. If not, look for alternatives like 'zipcode', 'sub_district', or 'ward'.
# 2. **Handle Errors:** If a query fails (e.g., "column not found"), do NOT retry the same query. Use `sql_db_schema` to find the correct column name, then rewrite the query.
# 3. **Complex Logic:** - If asked for a "Load" or "Index" (e.g., Hunger Load), write the mathematical formula directly in the SQL: `SELECT (col_a + col_b * 0.5) as metric ...`
#    - Do NOT fetch all raw data to Python. Keep the calculation in SQL.
# 4. **Formatting:** - Always use UPPERCASE for text filters (e.g., `district = 'JAIPUR'`).
#    - Use `LIMIT 5` for top lists.

# **Refusal Strategy:**
# If you cannot find relevant columns after checking the schema, honestly state: "The database does not contain Pincode or location data." Do not hallucinate.
# """

# # 4. Create the Universal Agent
# agent_executor = create_sql_agent(
#     llm=llm,
#     toolkit=toolkit,            # Gives it the tools to self-correct
#     agent_type="openai-tools",  # Works best for tool calling
#     verbose=True,               # See its "Thought Process" in terminal
#     prefix=UNIVERSAL_PROMPT,
#     handle_parsing_errors=True,
#     max_iterations=12           # Give it enough steps to explore -> error -> fix -> result
# )

# def ask_agent(query: str):
#     try:
#         # The agent will now autonomously explore and solve
#         response = agent_executor.invoke(query)
#         return response['output']
#     except Exception as e:
#         return f"System Error: {str(e)}"
# import os
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits import create_sql_agent
# from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_groq import ChatGroq
# from app.core.database import engine
# from dotenv import load_dotenv
# from pathlib import Path

# # 1. Setup
# env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
# load_dotenv(dotenv_path=env_path)

# if not os.getenv("GROQ_API_KEY"):
#     raise ValueError("GROQ_API_KEY not found in .env")

# # 2. Database & Toolkit
# db = SQLDatabase(engine)
# llm = ChatGroq(
#     model="llama-3.3-70b-versatile",
#     temperature=0
# )
# toolkit = SQLDatabaseToolkit(db=db, llm=llm)

# # 3. Optimized Universal Prompt
# UNIVERSAL_PROMPT = """
# You are an expert Data Analyst Agent. 
# Your goal is to answer user questions by querying a PostgreSQL database.

# **CRITICAL DATABASE RULES (Read Carefully):**
# 1. **Double Quotes for Tables:** The database uses Case-Sensitive table names. You MUST use double quotes for all table names.
#    - WRONG: `SELECT * FROM Enrolment` (This fails because Postgres converts it to lowercase 'enrolment')
#    - CORRECT: `SELECT * FROM "Enrolment"` (This works)
#    - CORRECT: `SELECT * FROM "Biometric"`
#    - CORRECT: `SELECT * FROM "Demographic"`

# 2. **Check Schema First:** - Never guess table names (e.g., do not invent a 'districts' table).
#    - Run `sql_db_list_tables` immediately to confirm table names.
#    - Run `sql_db_schema` to confirm column names.

# 3. **Complex Logic (Distribution/ratios):**
#    - If asked to distribute a resource (e.g., vaccines, food) based on population:
#      1. Calculate the raw count for the target districts first.
#      2. Use a CTE or math in SQL to calculate the share.
#      3. Formula: `(District_Count / Total_Count) * Total_Supply`

# **YOUR TOOLKIT:**
# 1. `sql_db_list_tables`: Use this first.
# 2. `sql_db_schema`: Use this second.
# 3. `sql_db_query`: Use this to execute valid SQL.

# **Refusal Strategy:**
# If a column (like 'pincode') does not exist after checking the schema, try 'sub_district' or 'district'. Do not crash.
# """

# # 4. Create the Universal Agent
# agent_executor = create_sql_agent(
#     llm=llm,
#     toolkit=toolkit,
#     agent_type="openai-tools",
#     verbose=True,
#     prefix=UNIVERSAL_PROMPT,
#     handle_parsing_errors=True,
#     max_iterations=10
# )

# def ask_agent(query: str):
#     try:
#         response = agent_executor.invoke(query)
#         return response['output']
#     except Exception as e:
#         return f"System Error: {str(e)}"
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
db = SQLDatabase(engine)
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)
toolkit = SQLDatabaseToolkit(db=db, llm=llm)

# 3. Strict System Prompt
UNIVERSAL_PROMPT = """
You are an expert Data Analyst Agent. 
Your goal is to answer user questions by querying a PostgreSQL database.

**CRITICAL DATABASE RULES:**
1. **Double Quotes are MANDATORY:** - Table names are Case-Sensitive. You MUST use `"Enrolment"`, `"Demographic"`, `"Biometric"`.
   - Column names might be Case-Sensitive. Check the schema.
   
2. **Zero Hallucination Policy:**
   - If asked to distribute resources (vaccines, food) based on population, you MUST fetch the population counts first.
   - **Never assume equal distribution.** If you cannot find the population count for a district, output "Data for [District] not found."
   - Always show the raw population count in your final answer to prove your math.

3. **Complex Logic (Weighted Distribution):**
   - Step 1: `SELECT district, SUM(age_0_5) FROM "Enrolment" WHERE district IN (...) GROUP BY district`
   - Step 2: Calculate the total population of the selected districts.
   - Step 3: Formula: `(District_Count / Total_Selected_Pop) * Total_Supply`

**YOUR TOOLKIT:**
1. `sql_db_list_tables`: Check table names first.
2. `sql_db_schema`: Check column names second.
3. `sql_db_query`: Execute SQL.

**Refusal Strategy:**
If a column (like 'pincode') does not exist, try 'sub_district'. If that fails, stop and report "Location data not available."
"""

# 4. Create Agent
agent_executor = create_sql_agent(
    llm=llm,
    toolkit=toolkit,
    agent_type="openai-tools",
    verbose=True,
    prefix=UNIVERSAL_PROMPT,
    handle_parsing_errors=True,
    max_iterations=10
)

def ask_agent(query: str):
    try:
        response = agent_executor.invoke(query)
        return response['output']
    except Exception as e:
        return f"System Error: {str(e)}"
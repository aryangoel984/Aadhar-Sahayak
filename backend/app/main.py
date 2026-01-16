from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.agents.multi_agent import ask_agent
from app.api import dashboard # <--- IMPORT NEW MODULE
from pydantic import BaseModel

app = FastAPI(title="Aadhaar Sahayak API")

# CORS (Keep existing config)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REGISTER DASHBOARD ROUTER ---
app.include_router(dashboard.router, prefix="/api") 
# Endpoints will be at: /api/stats/overview, /api/stats/anomalies
# ---------------------------------

class QueryRequest(BaseModel):
    text: str

@app.post("/chat")
async def chat_endpoint(request: QueryRequest):
    # Keep the chat functionality as a "feature", not the main page
    answer = ask_agent(request.text)
    return {"answer": answer}
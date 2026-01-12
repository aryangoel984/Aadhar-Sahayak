import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# 1. Load your .env file
env_path = Path(__file__).parent.parent/ ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY not found. Check your .env file.")
else:
    # 2. Configure the API
    genai.configure(api_key=api_key)

    print(f"Checking models for API Key ending in ...{api_key[-4:]}\n")
    print("Available Models for 'generateContent':")
    print("---------------------------------------")
    
    # 3. List all models
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error connecting to Google: {e}")
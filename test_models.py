import os
import httpx
from dotenv import load_dotenv

load_dotenv("ai-services/.env")
api_key = os.getenv("GEMINI_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
resp = httpx.get(url)
print(resp.status_code)
if resp.status_code == 200:
    models = resp.json().get("models", [])
    for m in models:
        print(m.get("name"), "-", m.get("displayName"))
else:
    print(resp.text)

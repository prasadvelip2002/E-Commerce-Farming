import asyncio
import os
from openai import AsyncOpenAI
import json
from dotenv import load_dotenv

load_dotenv("ai-services/.env")

client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

async def test():
    messages = [
        {"role": "user", "content": "hi"}
    ]
    try:
        response = await client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=messages
        )
        print("Success! Response:", response.choices[0].message.content)
    except Exception as e:
        print("Error with gemini-1.5-flash:", e)

if __name__ == "__main__":
    asyncio.run(test())

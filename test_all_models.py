import asyncio
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv("ai-services/.env")

client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

models_to_test = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-3.0-flash",
    "gemini-flash-latest"
]

async def test():
    messages = [{"role": "user", "content": "hi"}]
    for model in models_to_test:
        print(f"Testing {model}...")
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=messages
            )
            print(f"SUCCESS with {model}: {response.choices[0].message.content}")
            return
        except Exception as e:
            print(f"Error with {model}: {e}")

if __name__ == "__main__":
    asyncio.run(test())

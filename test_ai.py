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
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_market_products",
                "description": "Fetches the list of currently available products in the market.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            }
        }
    ]
    messages = [
        {"role": "user", "content": "What products are available?"}
    ]
    print("Sending request...")
    try:
        response = await client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        print("Response received")
        msg = response.choices[0].message
        print(msg)
        if msg.tool_calls:
            messages.append(msg)
            print("Tool call id:", msg.tool_calls[0].id)
            messages.append({
                "tool_call_id": msg.tool_calls[0].id,
                "role": "tool",
                "name": "get_market_products",
                "content": json.dumps([{"name": "Tomato", "price": 10}])
            })
            print("Sending tool response...")
            response2 = await client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=messages
            )
            print(response2.choices[0].message.content)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test())

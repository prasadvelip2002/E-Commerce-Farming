from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
import httpx
import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
from typing import Any
from routers.crop import recommend_crop, CropRequest
from routers.pricing import suggest_price, PricingRequest

load_dotenv()

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)

class ChatMessage(BaseModel):
    message: str
    sessionId: str | None = None
    cartContext: str | None = None

class ChatResponse(BaseModel):
    reply: str
    intent: str

# Create clients for both so we can fallback if needed
gemini_api_key = os.getenv("GEMINI_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

gemini_client = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
) if gemini_api_key else None

openai_client = AsyncOpenAI(
    api_key=openai_api_key
) if openai_api_key else None

SYSTEM_PROMPT = """
You are AgriBot, an intelligent and friendly farming assistant on the AgriMart platform.
You help farmers and buyers navigate the marketplace.
You can answer questions about crop pricing, farming best practices, plant diseases, and live market data.
If the user asks about currently available products or prices, you must use the `get_market_products` tool to fetch live data.
If the user asks about orders, use the `get_orders` tool.
If the user asks for crop recommendations based on soil or weather, use the `recommend_crop` tool. If they don't provide all details, you can make reasonable guesses (e.g. default to Loamy, 25C, 60% humidity) or ask them for more details.
If the user asks for a suggested selling price for a product, use the `suggest_price` tool.
Answer conversationally and concisely.
"""

tools: list[Any] = [
    {
        "type": "function",
        "function": {
            "name": "get_market_products",
            "description": "Fetches the list of currently available products in the market, including their names, categories, and base prices.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_orders",
            "description": "Fetches all active and past orders from the marketplace.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "recommend_crop",
            "description": "Recommends the best crop to plant based on soil type and climate.",
            "parameters": {
                "type": "object",
                "properties": {
                    "soil_type": {"type": "string", "description": "Type of soil (e.g. Sandy, Loamy, Clay, Red, Black)"},
                    "temperature": {"type": "number", "description": "Temperature in Celsius"},
                    "humidity": {"type": "number", "description": "Humidity percentage (0-100)"},
                    "rainfall": {"type": "number", "description": "Rainfall in mm per year"},
                    "nitrogen": {"type": "number", "description": "Nitrogen content in soil"},
                    "phosphorus": {"type": "number", "description": "Phosphorus content in soil"},
                    "potassium": {"type": "number", "description": "Potassium content in soil"}
                },
                "required": ["soil_type", "temperature", "humidity", "rainfall", "nitrogen", "phosphorus", "potassium"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "suggest_price",
            "description": "Suggests an optimized selling price for a product based on market dynamics.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {"type": "string", "description": "Name of the product"},
                    "base_price": {"type": "number", "description": "Base cost/price from the farmer (INR)"},
                    "category": {"type": "string", "description": "Category (Vegetable, Grain, Fruit, Dairy, Spice)"},
                    "stock_quantity": {"type": "integer", "description": "Available stock quantity"},
                    "season": {"type": "string", "description": "Current season (Kharif, Rabi, Summer)"},
                    "demand_index": {"type": "number", "description": "Market demand from 0.0 to 1.0 (default 0.5)"}
                },
                "required": ["product_name", "base_price", "category", "stock_quantity", "season"]
            }
        }
    }
]

async def fetch_market_products():
    try:
        async with httpx.AsyncClient() as http_client:
            api_base = os.getenv("API_BASE_URL", "http://localhost:5153")
            resp = await http_client.get(f"{api_base}/api/products")
            if resp.status_code == 200:
                return resp.json()
            return {"error": f"Failed to fetch products. Status code: {resp.status_code}"}
    except Exception as e:
        return {"error": str(e)}

async def fetch_orders():
    try:
        async with httpx.AsyncClient() as http_client:
            api_base = os.getenv("API_BASE_URL", "http://localhost:5153")
            resp = await http_client.get(f"{api_base}/api/orders/all")
            if resp.status_code == 200:
                return resp.json()
            return {"error": f"Failed to fetch orders. Status code: {resp.status_code}"}
    except Exception as e:
        return {"error": str(e)}

def fallback_chat_response(message: str, products_data: Any, orders_data: Any) -> str:
    msg = message.lower()
    
    # Check for greeting
    if any(x in msg for x in ["hi", "hello", "hey", "hola", "greetings", "helper", "bot", "agribot"]):
        return (
            "Hello! I am AgriBot (running in **Offline Local Mode** because the OpenAI API key is missing or quota is exceeded).\n\n"
            "Even in Offline Mode, I can help you inspect the live marketplace! Try asking me:\n"
            "- **'show products'** to list available crops/products\n"
            "- **'show orders'** to see recent customer purchases\n"
            "- **'recommend crop'** for farming suggestions\n"
            "- **'disease help'** for plant treatment tips"
        )
    
    # Check for products
    if any(x in msg for x in ["product", "item", "inventory", "stock", "price", "buy", "sell", "tomatoes", "peas", "wheat", "rice"]):
        if not products_data or (isinstance(products_data, dict) and "error" in products_data):
            return (
                "Offline Mode: I tried to fetch products from the local database, but encountered an error. "
                f"Make sure your C# API backend is running at {os.getenv('API_BASE_URL', 'http://localhost:5153')}!"
            )
        
        # If products_data is a list
        if isinstance(products_data, list) and len(products_data) > 0:
            lines = ["Here are the products currently available in the marketplace (fetched from local DB):"]
            for p in products_data[:10]:
                name = p.get("name", "Unknown Product")
                price = p.get("finalPrice", p.get("basePrice", "N/A"))
                unit = p.get("unitOfMeasure", "kg")
                category = p.get("category", "Uncategorized")
                farmer = p.get("farmerName", "Unknown").split("@")[0]
                lines.append(f"- **{name}** ({category}) by *{farmer}*: ₹{price}/{unit}")
            return "\n".join(lines)
        else:
            return "Offline Mode: There are currently no products listed in the marketplace database."
            
    # Check for orders
    if any(x in msg for x in ["order", "purchase", "track", "history"]):
        if not orders_data or (isinstance(orders_data, dict) and "error" in orders_data):
            return (
                "Offline Mode: I tried to fetch orders from the local database, but encountered an error. "
                f"Make sure your C# API backend is running at {os.getenv('API_BASE_URL', 'http://localhost:5153')}!"
            )
            
        if isinstance(orders_data, list) and len(orders_data) > 0:
            lines = ["Here are the recent orders registered in the system (fetched from local DB):"]
            for o in orders_data[:10]:
                oid = o.get("orderId", o.get("id", "N/A"))
                status = o.get("status", "N/A")
                total = o.get("totalAmount", "N/A")
                cust = o.get("customerName", "Guest")
                items_desc = ", ".join([f"{i.get('quantity')}x {i.get('name')}" for i in o.get("items", [])])
                lines.append(f"- **Order #{oid[:8]}...** by *{cust}* ({status}): total ₹{total} containing: {items_desc}")
            return "\n".join(lines)
        else:
            return "Offline Mode: There are currently no orders in the database."
            
    # Check for farming / crop tips
    if any(x in msg for x in ["farming", "crop", "plant", "grow", "recommend", "soil"]):
        return (
            "🌱 **Offline Crop Recommendation Tip:**\n\n"
            "For dynamic, data-driven crop suggestions based on nitrogen, phosphorus, potassium, temperature, humidity, pH, and rainfall, "
            "you can use our **Crop Recommendation** feature!\n\n"
            "**General agricultural guidance:**\n"
            "- **Clayey Soils**: Best for water-loving crops like Rice, Wheat, sugarcane.\n"
            "- **Sandy Loams**: Ideal for cotton, pulses, oilseeds, and vegetables.\n"
            "- **Alluvial Soils**: Excellent for almost all grains, vegetables, and fruits."
        )
        
    # Check for disease
    if any(x in msg for x in ["disease", "fungus", "leaf", "rot", "pest", "spot"]):
        return (
            "🍂 **Offline Disease Prevention Guide:**\n\n"
            "If your crops are showing yellowing leaves, spots, or rot, you can upload an image in the **Disease Detection** tab.\n\n"
            "**General organic practices:**\n"
            "1. **Neem Oil Spray**: Natural insecticide for aphids, whiteflies, and mites.\n"
            "2. **Copper Fungicide**: Good for early blight and leaf spot diseases.\n"
            "3. **Crop Rotation**: Crucial for breaking soil-borne pathogen cycles."
        )

    # General fallback response
    return (
        "I am currently running in **Offline Local Mode** due to an OpenAI API key/quota issue.\n\n"
        "Ask me about **'products'**, **'orders'**, **'farming'**, or **'diseases'** and I will assist you using local data!"
    )

@router.post("/audio", response_model=ChatResponse)
async def chat_with_audio(
    file: UploadFile = File(...),
    cartContext: str = Form(None)
):
    try:
        if not openai_client:
            return ChatResponse(reply="OpenAI client not configured for Whisper transcription.", intent="error")
            
        # Read the file bytes
        content = await file.read()
        
        # Save to temp file because openai library expects a file-like object with a name
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(content)
            
        # Transcribe audio using Whisper
        with open(temp_path, "rb") as audio_file:
            transcript = await openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            
        # Delete temp file
        os.remove(temp_path)
        
        transcribed_text = transcript.text
        if not transcribed_text:
            return ChatResponse(reply="Could not understand audio.", intent="error")
            
        print(f"Transcribed audio: {transcribed_text}")
            
        # Now pass the transcribed text to the existing text-based chat handler
        chat_message = ChatMessage(message=transcribed_text, cartContext=cartContext)
        return await chat_with_bot(chat_message)
        
    except Exception as e:
        print(f"Audio transcription error: {str(e)}")
        return ChatResponse(reply=f"Failed to process audio: {str(e)}", intent="error")

@router.post("", response_model=ChatResponse)
async def chat_with_bot(request: ChatMessage):
    # Check if API key is configured
    has_api_key = bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))
    
    if not has_api_key:
        # If API key is missing, immediately run local fallback
        try:
            products_data = await fetch_market_products()
            orders_data = await fetch_orders()
            reply = fallback_chat_response(request.message, products_data, orders_data)
            return ChatResponse(
                reply=f"⚠️ **[Offline Mode - OpenAI Key Missing]**\n\n{reply}",
                intent="offline_fallback"
            )
        except Exception as fallback_err:
            return ChatResponse(
                reply=f"Offline Mode error: failed to fetch local data. {str(fallback_err)}",
                intent="error"
            )
         
    # Build dynamic system prompt
    dynamic_system_prompt = SYSTEM_PROMPT
    if request.cartContext:
        dynamic_system_prompt += f"\n\nUSER'S CURRENT CART:\n{request.cartContext}\nIf the user asks about their cart, use this information."

    messages: list[Any] = [
        {"role": "system", "content": dynamic_system_prompt},
        {"role": "user", "content": request.message}
    ]
    
    # Determine which client and model to use
    current_client = gemini_client if gemini_client else openai_client
    model_name = "gemini-2.5-flash" if current_client == gemini_client else "gpt-4o-mini"
    
    if not current_client:
        return ChatResponse(
            reply="Offline Mode error: No valid API client configured (missing API keys).",
            intent="error"
        )

    try:
        response = await current_client.chat.completions.create(
            model=model_name,
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        
        # Check if the model wants to call a function
        if response_message.tool_calls:
            messages.append(response_message) # Add assistant's tool call request to history
            
            for tool_call in response_message.tool_calls:
                func = getattr(tool_call, "function", None)
                if not func:
                    continue
                func_name = getattr(func, "name", None)
                if func_name == "get_market_products":
                    products_data = await fetch_market_products()
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": "get_market_products",
                        "content": json.dumps(products_data)
                    })
                elif func_name == "get_orders":
                    orders_data = await fetch_orders()
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": "get_orders",
                        "content": json.dumps(orders_data)
                    })
                    
            # Get the final response from the model
            second_response = await current_client.chat.completions.create(
                model=model_name,
                messages=messages
            )
            final_reply = second_response.choices[0].message.content or ""
        else:
            final_reply = response_message.content or ""
            
        return ChatResponse(reply=final_reply, intent="openai_response")
        
    except Exception as e:
        # Check if the error is quota or billing related
        error_str = str(e)
        print(f"OpenAI exception caught: {error_str}")
        if "quota" in error_str.lower() or "limit" in error_str.lower() or "429" in error_str or "api_key" in error_str.lower() or "auth" in error_str.lower() or "insufficient_quota" in error_str.lower() or "503" in error_str or "unavailable" in error_str.lower():
            # If Gemini failed but we have OpenAI, try falling back to OpenAI
            if current_client == gemini_client and openai_client:
                print("Gemini quota exceeded, falling back to OpenAI gpt-4o-mini...")
                try:
                    response = await openai_client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=messages,
                        tools=tools,
                        tool_choice="auto"
                    )
                    
                    response_message = response.choices[0].message
                    if response_message.tool_calls:
                        messages.append(response_message)
                        for tool_call in response_message.tool_calls:
                            func = getattr(tool_call, "function", None)
                            if not func: continue
                            func_name = getattr(func, "name", None)
                            if func_name == "get_market_products":
                                products_data = await fetch_market_products()
                                messages.append({
                                    "tool_call_id": tool_call.id,
                                    "role": "tool",
                                    "name": "get_market_products",
                                    "content": json.dumps(products_data)
                                })
                            elif func_name == "get_orders":
                                orders_data = await fetch_orders()
                                messages.append({
                                    "tool_call_id": tool_call.id,
                                    "role": "tool",
                                    "name": "get_orders",
                                    "content": json.dumps(orders_data)
                                })
                            elif func_name == "recommend_crop":
                                args = json.loads(func.arguments)
                                req = CropRequest(**args)
                                res = recommend_crop(req)
                                messages.append({
                                    "tool_call_id": tool_call.id,
                                    "role": "tool",
                                    "name": "recommend_crop",
                                    "content": res.model_dump_json()
                                })
                            elif func_name == "suggest_price":
                                args = json.loads(func.arguments)
                                req = PricingRequest(**args)
                                res = suggest_price(req)
                                messages.append({
                                    "tool_call_id": tool_call.id,
                                    "role": "tool",
                                    "name": "suggest_price",
                                    "content": res.model_dump_json()
                                })
                        second_response = await openai_client.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=messages
                        )
                        return ChatResponse(reply=second_response.choices[0].message.content or "", intent="openai_response")
                    else:
                        return ChatResponse(reply=response_message.content or "", intent="openai_response")
                except Exception as fallback_ai_err:
                    print("OpenAI fallback also failed:", fallback_ai_err)
            
            try:
                products_data = await fetch_market_products()
                orders_data = await fetch_orders()
                reply = fallback_chat_response(request.message, products_data, orders_data)
                return ChatResponse(
                    reply=f"⚠️ **[Offline Mode - OpenAI Quota Exceeded/API Error]**\n\n{reply}",
                    intent="offline_fallback"
                )
            except Exception as fallback_err:
                print(f"Offline fallback data fetch error: {fallback_err}")
                return ChatResponse(
                    reply=f"Offline Mode error: failed to fetch local data. {str(fallback_err)}",
                    intent="error"
                )
        return ChatResponse(reply=f"Oops! Something went wrong while talking to OpenAI: {str(e)}", intent="error")

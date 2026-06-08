from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import crop, pricing, disease, chat, demand, quality, recommend

app = FastAPI(
    title="Agri AI Services",
    description="AI-powered services for the Agri E-Commerce Platform. Provides crop recommendations, dynamic pricing, plant disease detection, and an intelligent chatbot.",
    version="1.0.0",
    contact={"name": "Agri Platform Team"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production to .NET API origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop.router)
app.include_router(pricing.router)
app.include_router(disease.router)
app.include_router(chat.router)
app.include_router(demand.router)
app.include_router(quality.router)
app.include_router(recommend.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Agri AI Services",
        "version": "1.0.0",
        "endpoints": [
            "/crop/recommend",
            "/pricing/suggest",
            "/disease/detect",
            "/docs",
            "/demand/forecast",
            "/quality/scan",
            "/recommend/products",
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

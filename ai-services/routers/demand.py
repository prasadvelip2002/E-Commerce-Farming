from fastapi import APIRouter
import random
from typing import List, Dict

router = APIRouter(prefix="/demand", tags=["Demand Forecasting"])

@router.get("/forecast")
def get_demand_forecast(region: str = "all", crop: str = "all"):
    """
    Predicts future crop demand based on historical trends and simulated external factors.
    Returns dynamic simulated data for the upcoming months.
    """
    # Simulated AI logic for demand forecasting
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    base_demand = random.randint(50, 200)
    
    forecast = []
    for month in months:
        # Simulate some seasonal variation
        variation = random.uniform(0.8, 1.5)
        forecast.append({
            "month": month,
            "projected_demand_tons": round(base_demand * variation, 2),
            "confidence_score": round(random.uniform(0.7, 0.95), 2)
        })
        
    return {
        "region": region,
        "crop": crop,
        "forecast": forecast,
        "insights": "Demand is expected to peak in early spring due to favorable weather conditions."
    }

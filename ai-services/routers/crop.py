from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/crop", tags=["Crop Recommendation"])


class CropRequest(BaseModel):
    soil_type: str          # Sandy, Loamy, Clay, Red, Black
    temperature: float      # Celsius
    humidity: float         # Percentage 0-100
    rainfall: float         # mm per year
    nitrogen: float         # N content in soil
    phosphorus: float       # P content in soil
    potassium: float        # K content in soil


class CropResult(BaseModel):
    recommended_crop: str
    confidence: float
    alternative_crops: List[str]
    season: str
    tips: str


# Rule-based heuristic placeholder (replace with ML model in production)
_CROP_RULES: List[Dict[str, Any]] = [
    {"conditions": {"soil_type": "Black", "min_rainfall": 700}, "crop": "Cotton", "alts": ["Soybean", "Wheat"], "season": "Kharif"},
    {"conditions": {"soil_type": "Loamy", "min_rainfall": 1000}, "crop": "Rice", "alts": ["Jute", "Sugarcane"], "season": "Kharif"},
    {"conditions": {"soil_type": "Sandy", "max_temp": 30}, "crop": "Groundnut", "alts": ["Millet", "Barley"], "season": "Rabi"},
    {"conditions": {"soil_type": "Red", "min_nitrogen": 30}, "crop": "Maize", "alts": ["Sorghum", "Millets"], "season": "Kharif"},
    {"conditions": {}, "crop": "Wheat", "alts": ["Chickpea", "Mustard"], "season": "Rabi"},  # Default
]


def _match_rule(req: CropRequest) -> dict:
    for rule in _CROP_RULES:
        conds = rule["conditions"]
        if "soil_type" in conds and conds["soil_type"] != req.soil_type:
            continue
        if "min_rainfall" in conds and req.rainfall < float(conds["min_rainfall"]):
            continue
        if "max_temp" in conds and req.temperature > float(conds["max_temp"]):
            continue
        if "min_nitrogen" in conds and req.nitrogen < float(conds["min_nitrogen"]):
            continue
        return rule
    return _CROP_RULES[-1]  # Default


@router.post("/recommend", response_model=CropResult)
def recommend_crop(request: CropRequest) -> CropResult:
    """
    Recommend the best crop based on soil and climate parameters.
    
    In production, this would load a trained ML model (e.g., Random Forest or XGBoost)
    and run inference on the input features.
    """
    matched = _match_rule(request)
    confidence = 0.87 if matched["conditions"] else 0.65

    return CropResult(
        recommended_crop=matched["crop"],
        confidence=confidence,
        alternative_crops=matched["alts"],
        season=matched["season"],
        tips=f"Best sown during {matched['season']} season. Ensure adequate irrigation for your {request.soil_type} soil."
    )

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/disease", tags=["Disease Detection"])


class DiseaseRequest(BaseModel):
    image_url: str
    crop_type: str   # e.g., "Wheat", "Tomato", "Rice"


class DiseaseResult(BaseModel):
    disease_detected: bool
    disease_name: str
    confidence: float
    affected_area_percent: float
    treatments: List[str]
    prevention_tips: List[str]
    severity: str  # Low, Moderate, High, Critical


# Stub disease database (replace with CNN model like ResNet-50 / EfficientNet in production)
_DISEASE_STUBS = {
    "Wheat":  {
        "disease": "Wheat Rust (Puccinia striiformis)",
        "confidence": 0.92,
        "affected": 35.0,
        "treatments": ["Apply Propiconazole 25% EC fungicide", "Remove and destroy infected leaves", "Use resistant wheat varieties"],
        "prevention": ["Crop rotation", "Avoid dense sowing", "Monitor weekly during humid season"],
        "severity": "High"
    },
    "Tomato": {
        "disease": "Early Blight (Alternaria solani)",
        "confidence": 0.88,
        "affected": 22.0,
        "treatments": ["Apply Mancozeb 75% WP", "Remove infected lower leaves", "Avoid overhead irrigation"],
        "prevention": ["Mulch around plant base", "Stake plants for air circulation", "Use certified disease-free seeds"],
        "severity": "Moderate"
    },
    "Rice": {
        "disease": "Rice Blast (Magnaporthe oryzae)",
        "confidence": 0.94,
        "affected": 48.0,
        "treatments": ["Spray Tricyclazole 75% WP", "Drain water from field for 5-7 days", "Apply silicon-based fertilizer"],
        "prevention": ["Balanced nitrogen application", "Proper spacing", "Avoid night irrigation"],
        "severity": "Critical"
    },
}

_DEFAULT_STUB = {
    "disease": "Unclassified Leaf Spot Disease",
    "confidence": 0.65,
    "affected": 15.0,
    "treatments": ["Consult local agronomist", "Apply broad-spectrum fungicide", "Increase field monitoring"],
    "prevention": ["General crop hygiene", "Use certified seeds", "Avoid waterlogging"],
    "severity": "Low"
}


@router.post("/detect", response_model=DiseaseResult)
def detect_disease(request: DiseaseRequest) -> DiseaseResult:
    """
    Detect crop disease from an image URL.
    
    In production, this would:
    1. Download the image from the URL
    2. Pre-process with OpenCV
    3. Run inference using a trained CNN (e.g., ResNet-50 fine-tuned on PlantVillage dataset)
    4. Return the top-K predictions
    """
    stub = _DISEASE_STUBS.get(request.crop_type, _DEFAULT_STUB)

    return DiseaseResult(
        disease_detected=True,
        disease_name=stub["disease"],
        confidence=stub["confidence"],
        affected_area_percent=stub["affected"],
        treatments=stub["treatments"],
        prevention_tips=stub["prevention"],
        severity=stub["severity"]
    )

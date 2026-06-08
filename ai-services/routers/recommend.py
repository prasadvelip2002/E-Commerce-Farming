from fastapi import APIRouter
import random

router = APIRouter(prefix="/recommend", tags=["Recommendations"])

@router.get("/products")
def get_recommended_products(customer_id: str, limit: int = 5):
    """
    Collaborative filtering simulation to suggest products based on customer history.
    """
    # Simulated product catalog
    catalog = [
        {"id": "p1", "name": "Organic Tomatoes", "category": "Vegetables", "price": 4.5},
        {"id": "p2", "name": "Fresh Strawberries", "category": "Fruits", "price": 6.0},
        {"id": "p3", "name": "Whole Wheat Flour", "category": "Grains", "price": 3.2},
        {"id": "p4", "name": "Free-range Eggs", "category": "Dairy", "price": 5.5},
        {"id": "p5", "name": "Avocados", "category": "Fruits", "price": 7.0},
        {"id": "p6", "name": "Sweet Potatoes", "category": "Vegetables", "price": 3.0},
        {"id": "p7", "name": "Raw Honey", "category": "Pantry", "price": 9.5},
    ]
    
    # Shuffle to simulate dynamic recommendations
    random.shuffle(catalog)
    recommendations = catalog[:limit]
    
    return {
        "customer_id": customer_id,
        "recommendations": recommendations,
        "reasoning": "Based on your recent purchases of fresh vegetables and pantry items."
    }

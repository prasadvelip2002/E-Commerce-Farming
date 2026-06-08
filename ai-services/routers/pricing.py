from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/pricing", tags=["Dynamic Pricing"])


class PricingRequest(BaseModel):
    product_name: str
    base_price: float           # Farmer's base price (INR/kg)
    category: str               # e.g., "Vegetable", "Grain", "Fruit"
    stock_quantity: int
    season: str                 # "Kharif", "Rabi", "Summer"
    demand_index: Optional[float] = 0.5  # 0.0 = very low, 1.0 = very high


class PricingResult(BaseModel):
    suggested_price: float
    margin_percentage: float
    reasoning: str
    price_range_min: float
    price_range_max: float


# Simplified dynamic pricing algorithm (replace with real market ML model)
_SEASON_MULTIPLIERS = {
    "Kharif": 1.05,
    "Rabi": 1.10,
    "Summer": 1.20,  # Off-season premium
}

_CATEGORY_MARGINS = {
    "Vegetable": 0.18,
    "Fruit": 0.22,
    "Grain": 0.15,
    "Dairy": 0.12,
    "Spice": 0.25,
}


@router.post("/suggest", response_model=PricingResult)
def suggest_price(request: PricingRequest) -> PricingResult:
    """
    Suggest an optimized final price for a product based on demand, season, and category.
    
    In production, this would use a trained regression model trained on real market data
    (e.g., AGMARKNET datasets) to predict optimal prices.
    """
    season_mult = _SEASON_MULTIPLIERS.get(request.season, 1.0)
    base_margin = _CATEGORY_MARGINS.get(request.category, 0.20)

    # Demand adjustment: higher demand -> can charge up to 15% more
    demand_idx = request.demand_index if request.demand_index is not None else 0.5
    demand_adjustment = 1.0 + (demand_idx * 0.15)

    # Stock pressure: low stock -> slight price increase
    stock_pressure = 1.05 if request.stock_quantity < 50 else 1.0

    final_price = round(request.base_price * (1 + base_margin) * season_mult * demand_adjustment * stock_pressure, 2)
    margin_pct = round(((final_price - request.base_price) / request.base_price) * 100, 1)

    return PricingResult(
        suggested_price=final_price,
        margin_percentage=margin_pct,
        reasoning=(
            f"{request.category} in {request.season} season with demand index {demand_idx:.1f}. "
            f"Applied {base_margin*100:.0f}% base margin + seasonal and demand adjustments."
        ),
        price_range_min=round(final_price * 0.92, 2),
        price_range_max=round(final_price * 1.08, 2),
    )

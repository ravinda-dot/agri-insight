# backend/app/routers/prices.py

from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from app.services.agmarknet_service import fetch_prices_from_agmarknet

router = APIRouter(
    prefix="/api/prices",
    tags=["Market Prices"],
)

@router.get("/live")
async def get_live_market_prices(
    state: str = Query("Andhra Pradesh", description="State to query"),
    # --- CHANGE THIS LINE ---
    district: str = Query("Guntur", description="District to query"),
    # --- CHANGE THIS LINE ---
    market: str = Query("Guntur", description="Market to query")
) -> List[Dict[str, Any]]:
    if not all([state, district, market]):
        raise HTTPException(status_code=400, detail="State, district, and market parameters are required.")

    records = await fetch_prices_from_agmarknet(state, district, market)

    if not records:
        raise HTTPException(status_code=404, detail=f"No recent price data found for {market}.")

    return records
from fastapi import APIRouter, HTTPException
from typing import List
from ..services import location_service

router = APIRouter(
    prefix="/api/locations",
    tags=["Local CSV Locations"],
)

@router.get("/all-markets")
async def get_all_markets_from_csv():
    markets = location_service.get_all_markets()
    if not markets:
        raise HTTPException(status_code=404, detail="No markets found in local data file.")
    return markets

@router.get("/commodities")
async def get_all_commodities_from_csv():
    commodities = location_service.get_all_commodities()
    if not commodities:
        raise HTTPException(status_code=404, detail="No commodities found in local data file.")
    return commodities
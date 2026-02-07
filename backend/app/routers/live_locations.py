from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.services import live_location_service

router = APIRouter(
    prefix="/api/live-locations",
    tags=["Live Locations"],
)

@router.get("/states", response_model=List[str])
async def get_states_from_api():
    states = live_location_service.get_live_states()
    if not states:
        raise HTTPException(status_code=404, detail="Could not find any states in the live data file.")
    return states

@router.get("/districts", response_model=List[str])
async def get_districts_from_api(state: str = Query(...)):
    districts = live_location_service.get_live_districts_for_state(state)
    if not districts:
        raise HTTPException(status_code=404, detail=f"Could not find any districts for the state: {state}.")
    return districts

@router.get("/markets", response_model=List[str])
async def get_markets_from_api(district: str = Query(...)):
    markets = live_location_service.get_live_markets_for_district(district)
    if not markets:
        raise HTTPException(status_code=404, detail=f"Could not find any markets for the district: {district}.")
    return markets
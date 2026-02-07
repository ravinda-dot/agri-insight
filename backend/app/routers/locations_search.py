import json
from fastapi import APIRouter, Query, HTTPException
from pathlib import Path

router = APIRouter(
    prefix="/api/locations",
    tags=["Locations"],
)

# Load the location data from the JSON file on startup
locations_data = []
try:
    # This path navigation assumes this file is in backend/app/routers/
    PROJECT_ROOT = Path(__file__).resolve().parents[3]
    LOCATIONS_FILE = PROJECT_ROOT / 'backend' / 'app' / 'data' / 'india_locations.json'
    with open(LOCATIONS_FILE, 'r', encoding='utf-8') as f:
        locations_data = json.load(f)
    print("✅ Indian locations data loaded successfully.")
except Exception as e:
    print(f"❌ ERROR: Could not load Indian locations data: {e}")


@router.get("/search")
def search_locations(q: str = Query(..., min_length=2, description="Search query for city")):
    """
    Searches for cities in India based on a query string.
    """
    if not locations_data:
        raise HTTPException(status_code=500, detail="Location data is not available.")

    search_term = q.lower()
    results = []
    
    # Limit results to prevent sending too much data
    limit = 10
    
    for state_data in locations_data:
        state_name = state_data.get("state")
        for city in state_data.get("cities", []):
            if search_term in city.get("name", "").lower():
                results.append({
                    "name": city["name"],
                    "state": state_name,
                    "lat": city["lat"],
                    "lon": city["lon"]
                })
            if len(results) >= limit:
                break
        if len(results) >= limit:
            break
            
    return results
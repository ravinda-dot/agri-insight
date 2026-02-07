import httpx
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(
    prefix="/api/weather",
    tags=["Weather"],
)

WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"

@router.get("/")
async def get_weather_forecast(
    # These lines are the key fix.
    # They tell FastAPI to read 'lat' and 'lon' from the URL query.
    # If they are not provided, it uses the default values for Ongole.
    lat: float = Query(15.5057, description="Latitude for the weather forecast"),
    lon: float = Query(80.0463, description="Longitude for the weather forecast")
):
    """
    Provides a 7-day weather forecast for a specific location.
    """
    # The 'params' dictionary now uses the lat and lon passed from the frontend.
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max",
        "timezone": "auto"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(WEATHER_API_URL, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=503, detail=f"An error occurred while requesting the weather service: {exc}")
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error response from weather service: {exc.response.text}")
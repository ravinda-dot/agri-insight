from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from typing import List, Dict, Optional

router = APIRouter(
    prefix="/api/advisor",
    tags=["AI Advisor"],
)

# Configuration for the Gemini API
GEMINI_API_KEY = "gemini api key" # Handled by the execution environment
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={GEMINI_API_KEY}"

# --- This Pydantic model is for the weather page advisor ---
class WeatherAdviceRequest(BaseModel):
    crop_name: str
    weather_data: List[Dict]
    location_name: str

# --- This is the NEW Pydantic model for the soil moisture page advisor ---
class SoilAdviceRequest(BaseModel):
    crop_name: str
    soil_moisture: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None

@router.post("/weather-suggestion")
async def get_weather_suggestion(request: WeatherAdviceRequest):
    """
    Receives weather forecast data and a crop name, then asks Gemini for farming advice.
    """
    # This endpoint for the weather page remains unchanged
    weather_summary = ", ".join([
        f"{day['date']}: {day['weather']['description']} ({day['tempMax']}°C)" 
        for day in request.weather_data
    ])
    
    system_prompt = "You are an expert agricultural advisor for Indian farming. Provide clear, actionable advice in markdown bullet points."
    
    user_query = (
        f"For a farmer growing {request.crop_name} in {request.location_name}, India, provide 2-3 specific suggestions based on this 7-day weather forecast: {weather_summary}"
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(GEMINI_API_URL, json=payload)
            response.raise_for_status()
            result = response.json()
            text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
            if not text:
                raise HTTPException(status_code=500, detail="Received empty response from AI.")
            return {"advice": text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating advice: {e}")


# --- THIS IS THE NEW ENDPOINT FOR THE SOIL MOISTURE PAGE ---
@router.post("/soil-suggestion")
async def get_soil_suggestion(request: SoilAdviceRequest):
    """
    Receives live sensor data and a crop name, then asks Gemini for immediate advice.
    """
    system_prompt = "You are an expert agricultural advisor for Indian farming. Provide clear, actionable advice based on live soil conditions. Use simple language and markdown bullet points."
    
    user_query = (
        f"I am growing {request.crop_name}. My farm sensor is reporting a current soil moisture of {request.soil_moisture:.1f}%, "
        f"a temperature of {request.temperature:.1f}°C, and humidity of {request.humidity:.1f}%. "
        f"Based on these live conditions, what is one immediate action I should consider today? "
        f"Focus on irrigation (watering) advice. For example, if the soil is dry, recommend watering. If it is wet, recommend holding off."
    )

    payload = {
        "contents": [{"parts": [{"text": user_query}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(GEMINI_API_URL, json=payload)
            response.raise_for_status()
            result = response.json()
            text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
            if not text:
                raise HTTPException(status_code=500, detail="Received empty response from AI.")
            return {"advice": text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating advice: {e}")

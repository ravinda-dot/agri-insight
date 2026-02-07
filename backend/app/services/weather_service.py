import openmeteo_requests
import requests_cache
from retry_requests import retry
import pandas as pd

def get_weather_forecast(latitude: float = 15.5057, longitude: float = 80.0463):
    """
    Fetches and processes a 7-day daily weather forecast for a specific location.
    Defaults to Ongole, Andhra Pradesh.
    """
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # Define the API URL and the specific daily parameters needed for the app
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["weathercode", "temperature_2m_max", "temperature_2m_min", "precipitation_sum", "windspeed_10m_max"],
        "timezone": "auto"
    }

    # Fetch the data
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    print(f"Processing forecast for: {response.Latitude()}°N, {response.Longitude()}°E")

    # Process the daily data
    daily = response.Daily()
    daily_weather_code = daily.Variables(0).ValuesAsNumpy()
    daily_temperature_2m_max = daily.Variables(1).ValuesAsNumpy()
    daily_temperature_2m_min = daily.Variables(2).ValuesAsNumpy()
    daily_precipitation_sum = daily.Variables(3).ValuesAsNumpy()
    daily_windspeed_10m_max = daily.Variables(4).ValuesAsNumpy()

    # Create a dictionary with the processed data, ready for an API response
    daily_data = {
        "time": pd.to_datetime(daily.Time(), unit="s", utc=True).strftime('%Y-%m-%d').tolist(),
        "weathercode": daily_weather_code.tolist(),
        "temperature_2m_max": [round(val, 1) for val in daily_temperature_2m_max],
        "temperature_2m_min": [round(val, 1) for val in daily_temperature_2m_min],
        "precipitation_sum": [round(val, 2) for val in daily_precipitation_sum],
        "windspeed_10m_max": [round(val, 1) for val in daily_windspeed_10m_max]
    }

    return {"daily": daily_data}

# This block allows you to run the file directly to test the function
if __name__ == "__main__":
    import json

    # 1. Get forecast for the default location (Ongole)
    ongole_forecast = get_weather_forecast()
    print("\n--- Forecast for Ongole, Andhra Pradesh ---")
    print(json.dumps(ongole_forecast, indent=2))

    # 2. Get forecast for a different location (e.g., Bengaluru)
    bengaluru_forecast = get_weather_forecast(latitude=12.9716, longitude=77.5946)
    print("\n--- Forecast for Bengaluru, Karnataka ---")
    print(json.dumps(bengaluru_forecast, indent=2))
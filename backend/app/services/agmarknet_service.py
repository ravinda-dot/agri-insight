# backend/app/services/agmarknet_service.py

from typing import List, Dict, Any
import httpx
from datetime import date, timedelta

API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

async def fetch_prices_from_agmarknet(
    state: str, district: str, market: str
) -> List[Dict[str, Any]]:
    """
    Fetches live price data from the official AGMARKNET API for a specific location.
    """
    today = date.today()
    params = {
        "api-key": API_KEY,
        "format": "json",
        "offset": "0",
        "limit": "50",
        "filters[state]": state,
        "filters[district]": district,
        "filters[market]": market,
    }

    async with httpx.AsyncClient() as client:
        # --- THIS IS THE LINE TO CHANGE ---
        # Look back up to 7 days to find the most recent data.
        for i in range(7):  # Changed from 3 to 7
            # ---------------------------------
            check_date = today - timedelta(days=i)
            params["filters[arrival_date]"] = check_date.strftime("%d-%b-%Y")
            
            try:
                response = await client.get(API_URL, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()

                if data and data.get("records"):
                    print(f"Successfully fetched {len(data['records'])} records for {market} on {check_date}")
                    return data["records"]
                    
            except httpx.RequestError as exc:
                print(f"An error occurred while requesting {exc.request.url!r}.")
                return []
            except httpx.HTTPStatusError as exc:
                print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
                return []

    print(f"No recent data found for {market} in the last 7 days.")
    return []
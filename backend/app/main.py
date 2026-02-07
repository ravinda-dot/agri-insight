from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# --- IMPORT ALL YOUR ROUTERS HERE ---
from app.routers import (
    prices, 
    live_locations, 
    prediction, 
    locations, 
    weather, 
    locations_search, 
    ai_advisor,
    iot  # <-- The new router for your IoT device
)

app = FastAPI(title="Agri-Insight API")

# This middleware allows your React frontend (running on localhost:3000)
# to make requests to this backend server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.56.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUDE ALL THE ROUTERS TO ACTIVATE THE ENDPOINTS ---
app.include_router(prices.router)
app.include_router(live_locations.router)
app.include_router(prediction.router)
app.include_router(locations.router) 
app.include_router(weather.router)
app.include_router(locations_search.router)
app.include_router(ai_advisor.router)
app.include_router(iot.router) # <-- Activate the new IoT endpoint

@app.get("/")
def read_root():
    """A simple root endpoint to confirm the server is running."""
    return {"message": "Welcome to the Agri-Insight Backend!"}
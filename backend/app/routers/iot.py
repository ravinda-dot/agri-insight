from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="IoT Sensor API")
router = APIRouter(
    prefix="/api/iot",
    tags=["IoT"],
)

# Pydantic model for incoming sensor data
class SensorData(BaseModel):
    device_id: str
    soil_moisture: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_fertility: Optional[float] = None
    light_intensity: Optional[float] = None

# In-memory storage for latest sensor data per device
latest_sensor_data = {}

# POST endpoint - ESP32 sends data here
@router.post("/sensor-data")
async def receive_sensor_data(data: SensorData):
    print(f"Received data from device {data.device_id}: {data.dict()}")
    latest_sensor_data[data.device_id] = data
    return {"status": "success", "message": "Data received"}

# GET endpoint - frontend fetches latest data
@router.get("/latest-data/{device_id}")
async def get_latest_data(device_id: str):
    if device_id not in latest_sensor_data:
        return {
            "device_id": device_id,
            "soil_moisture": 0,
            "temperature": 0,
            "humidity": 0,
            "soil_fertility": 0,
            "light_intensity": 0,
            "message": "No data received yet."
        }
    return latest_sensor_data[device_id]

# Include router
app.include_router(router)

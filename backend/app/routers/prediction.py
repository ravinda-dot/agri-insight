from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict
from app.services import prediction_service

router = APIRouter(
    prefix="/api/predict",
    tags=["Prediction"],
)

@router.get("/price")
def get_price_prediction(
    periods: int = Query(7, description="Number of future periods (months) to forecast.", ge=1, le=24)
) -> List[Dict]:
    """
    Provides a future price forecast for Cotton in the Ongole market
    using the default pre-trained model.
    """
    predictions = prediction_service.predict_future_prices(periods)
    if "error" in predictions[0]:
        raise HTTPException(status_code=500, detail=predictions[0]["error"])
    
    return predictions
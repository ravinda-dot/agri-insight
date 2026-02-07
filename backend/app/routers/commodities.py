from fastapi import APIRouter
import os
from typing import Dict, List
from app.services import commodity_service

# Change this line
DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'app_data.csv')

router = APIRouter(
    prefix="/api/commodities",
    tags=["Commodities"],
)

@router.get("/categorized")
def get_categorized_commodities() -> Dict[str, List[str]]:
    """
    Returns a dictionary of commodity categories with their items.
    """
    return commodity_service.categorize_commodities()
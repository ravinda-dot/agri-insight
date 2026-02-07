# backend/app/services/commodity_service.py
import pandas as pd
import os
from typing import Dict, List

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'market_data_for_training.csv')

try:
    df = pd.read_csv(DATA_FILE_PATH)
    df.columns = [col.strip().lower() for col in df.columns]
except FileNotFoundError:
    df = pd.DataFrame()

def categorize_commodities() -> Dict[str, List[str]]:
    """
    Reads the data and groups commodities into categories.
    """
    if df.empty:
        return {}

    # Simple categorization based on keywords
    def get_category(commodity_name):
        commodity_name = str(commodity_name).lower()
        if any(veg in commodity_name for veg in ['potato', 'onion', 'tomato', 'brinjal', 'cabbage', 'carrot', 'cauliflower', 'lemon']):
            return 'Vegetables'
        if any(millet in commodity_name for millet in ['bajra', 'jowar', 'ragi']):
            return 'Millets'
        if any(cereal in commodity_name for cereal in ['wheat', 'paddy', 'maize', 'rice']):
            return 'Cereals & Grains'
        if 'cotton' in commodity_name:
            return 'Fibers'
        if 'chilli' in commodity_name:
            return 'Spices'
        return 'Other'

    df['category'] = df['commodity'].apply(get_category)
    
    categorized = {}
    for category in df['category'].unique():
        commodities = df[df['category'] == category]['commodity'].unique().tolist()
        categorized[category] = sorted(commodities)
        
    return categorized
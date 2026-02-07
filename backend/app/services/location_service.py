import pandas as pd
from typing import List
import os

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'app_data.csv')

try:
    df_app_data = pd.read_csv(DATA_FILE_PATH)
    df_app_data.columns = [x.lower().strip() for x in df_app_data.columns]
except FileNotFoundError:
    df_app_data = pd.DataFrame()

def get_all_commodities() -> List[str]:
    """Returns a sorted list of unique commodities from app_data.csv."""
    if not df_app_data.empty and 'commodity' in df_app_data.columns:
        return sorted(df_app_data['commodity'].dropna().unique().tolist())
    return []

def get_all_markets() -> List[str]:
    """Returns a sorted list of unique markets from app_data.csv."""
    if not df_app_data.empty and 'market' in df_app_data.columns:
        return sorted(df_app_data['market'].dropna().unique().tolist())
    return []
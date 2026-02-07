import pandas as pd
from typing import List
import os

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', '9ef84268-d588-465a-a308-a864a43d0070.csv')

def load_live_data():
    try:
        df = pd.read_csv(DATA_FILE_PATH)
        df.columns = [col.strip().lower().replace('_x0020_', '_') for col in df.columns]
        return df
    except Exception as e:
        print(f"Error loading live data: {e}")
        return pd.DataFrame()

def get_live_states() -> List[str]:
    df_live_data = load_live_data()
    if not df_live_data.empty and 'state' in df_live_data.columns:
        return sorted(df_live_data['state'].dropna().unique().tolist())
    return []

def get_live_districts_for_state(state: str) -> List[str]:
    df_live_data = load_live_data()
    if not df_live_data.empty and 'state' in df_live_data.columns:
        state_df = df_live_data[df_live_data['state'].str.lower() == state.lower()]
        if not state_df.empty:
            return sorted(state_df['district'].dropna().unique().tolist())
    return []

def get_live_markets_for_district(district: str) -> List[str]:
    df_live_data = load_live_data()
    if not df_live_data.empty and 'district' in df_live_data.columns:
        district_df = df_live_data[df_live_data['district'].str.lower() == district.lower()]
        if not district_df.empty:
            return sorted(district_df['market'].dropna().unique().tolist())
    return []
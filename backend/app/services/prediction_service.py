import pickle
import pandas as pd
from pathlib import Path
from typing import List, Dict

# --- 1. Robust Model Path Loading ---
# This new method dynamically finds the model file, making it much more reliable.
model = None
model_path_str = ""
try:
    # This assumes this script is in backend/app/services/
    # It navigates up three parent directories to find the project root.
    PROJECT_ROOT = Path(__file__).resolve().parents[3]
    MODEL_PATH = PROJECT_ROOT / 'backend' / 'app' / 'ml' / 'price_model_rf.pkl'
    model_path_str = str(MODEL_PATH)

    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    print("✅ Prediction model loaded successfully.")
except FileNotFoundError:
    print(f" ERROR: Model file not found at the calculated path: {model_path_str}")
    model = None
except Exception as e:
    print(f" An error occurred while loading the model: {e}")
    model = None


def predict_future_prices(periods: int) -> List[Dict]:
    """
    Predicts prices for a given number of future days.
    """
    if model is None:
        # This error is sent back to the frontend if the model didn't load on startup.
        return [{"error": "Model is not loaded. Check the backend server's terminal for detailed errors."}]

    # --- 2. Daily Prediction Logic ---
    # This now generates a forecast for the next 'n' days, not months.
    today = pd.to_datetime('today').normalize() # Use normalize() to get the date at midnight
    future_dates = pd.date_range(start=today, periods=periods, freq='D')
    
    # Create the features (year, month) that the model was trained on
    future_features = pd.DataFrame({
        'year': future_dates.year,
        'month': future_dates.month
    })

    # Make predictions using the loaded model
    future_predictions = model.predict(future_features)

    # Format the results into a clean list of dictionaries
    results = []
    for date, price in zip(future_dates, future_predictions):
        results.append({
            "date": date.strftime('%Y-%m-%d'),
            "predicted_price": round(price, 2)
        })
        
    return results
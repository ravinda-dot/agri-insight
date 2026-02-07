import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
import os
import numpy as np

def train_and_save_default_model():
    print("--- Starting Default Model Training (Random Forest) ---")
    data_path = os.path.join('backend', 'app', 'data', 'app_data.csv')

    try:
        df = pd.read_csv(data_path)
        print(f"Successfully loaded data from {data_path}")
    except FileNotFoundError:
        print(f"ERROR: Could not find data at {data_path}")
        return

    # Feature Engineering
    df['arrival_date'] = pd.to_datetime(df['arrival_date'])
    df['year'] = df['arrival_date'].dt.year
    df['month'] = df['arrival_date'].dt.month

    X = df[['year', 'month']]
    y = df['modal_price']

    # Train Model
    print("Training RandomForestRegressor model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    print("Model training complete.")

    # Save the Model
    model_dir = os.path.join('backend', 'app', 'ml')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'price_model_rf.pkl')
    with open(model_path, 'wb') as pkl:
        pickle.dump(model, pkl)
    print(f"--- Model successfully saved to {model_path} ---")

if __name__ == "__main__":
    train_and_save_default_model()
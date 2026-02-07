# Agri-Insight

Agri-Insight is a full-stack web application that provides live mandi (market) prices, crop price predictions, and market intelligence for Indian agriculture. It leverages FastAPI for the backend, React for the frontend, and machine learning for price forecasting.

---

## Features

- **Live Market Prices:**  
  View real-time mandi prices for various commodities across India.
- **Price Prediction:**  
  Predict future prices for selected commodities and markets using machine learning.
- **Market & Commodity Explorer:**  
  Browse available states, districts, markets, and commodities.
- **(Coming Soon) Farmer News:**  
  Stay updated with the latest agricultural news.

---

## Tech Stack

- **Backend:** FastAPI, Pandas, scikit-learn
- **Frontend:** React (JavaScript)
- **Data:** CSV files (historical and live market data)
- **ML:** Random Forest Regressor for price prediction

---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Install dependencies:**
    ```sh
    cd backend
    pip install -r requirements.txt
    ```

2. **Run the FastAPI server:**
    ```sh
    uvicorn app.main:app --reload
    ```

3. **(Optional) Train the ML model:**
    ```sh
    python ml_trainer.py
    ```

### Frontend Setup

1. **Install dependencies:**
    ```sh
    cd frontend
    npm install
    ```

2. **Start the React app:**
    ```sh
    npm start
    ```

3. The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
agri-insight/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── data/
│   │   └── main.py
│   ├── ml_trainer.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/
    │   └── App.js
    └── package.json
```

---

## API Endpoints

### Market Prices

- `GET /api/prices/live?state=&district=&market=`  
  Get live mandi prices for a specific location.

### Price Prediction

- `GET /api/predict/price?market=&commodity=&periods=`  
  Predict future prices for a commodity in a market.

### Locations

- `GET /api/locations/all-markets`  
  List all available markets.
- `GET /api/locations/commodities`  
  List all available commodities.

### (Planned) News

- `GET /api/news`  
  Get latest agricultural news.

---

## Data

- **app_data.csv:** Main historical price data for training and predictions.
- **market_locations.csv:** List of available markets.
- **market_data_for_training.csv:** Used for commodity categorization.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

This project is for educational and research purposes.

---

## Acknowledgements

- [AGMARKNET](https://agmarknet.gov.in/) for market data
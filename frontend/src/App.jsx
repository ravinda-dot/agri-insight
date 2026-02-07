import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MarketPricePage from './pages/MarketPricePage';
import PredictionPage from './pages/PredictionPage';
import WeatherPage from './pages/WeatherPage';
import SoilMoisturePage from './pages/SoilMoisturePage';

function App() {
    return (
        <Router>
            <Routes>
                {/* This tells the app to use your AppLayout for all main pages */}
                <Route path="/" element={<AppLayout />}>
                    
                    {/* The 'index' route is the default page (your dashboard) */}
                    <Route index element={<DashboardPage />} />
                    
                    {/* These are the other pages */}
                    <Route path="prices" element={<MarketPricePage />} />
                    <Route path="predict" element={<PredictionPage />} />
                    <Route path="weather" element={<WeatherPage />} />
                    <Route path="soil-moisture" element={<SoilMoisturePage />} />
                    
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
import React from 'react';
import DashboardCard from '../components/DashboardCard';
// Make sure to import the new SoilIcon
import { PriceIcon, PredictIcon, WeatherIcon, SoilIcon } from '../components/Icons';

function DashboardPage() {
    return (
        <section>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Market Intelligence Dashboard</h1>
                <p className="text-gray-500 mt-2">Select a feature to get started</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                {/* Your existing features */}
                <DashboardCard to="/prices" icon={<PriceIcon />} title="Live Price" />
                <DashboardCard to="/predict" icon={<PredictIcon />} title="Price Prediction" />
                <DashboardCard to="/weather" icon={<WeatherIcon />} title="Weather" />

                {/* --- ADD THIS NEW CARD --- */}
                <DashboardCard to="/soil-moisture" icon={<SoilIcon />} title="Soil Moisture" />

            </div>
        </section>
    );
}

export default DashboardPage;
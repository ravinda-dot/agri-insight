import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';
const DEVICE_ID = "farm01"; // This must match the device_id in your ESP32 code

// Helper function to get a color based on soil moisture percentage
const getMoistureColor = (percentage) => {
    if (percentage < 30) return 'bg-red-500';   // Dry
    if (percentage < 60) return 'bg-green-500'; // Good
    return 'bg-blue-500';                       // Wet
};

function SoilMoisturePage() {
    const [sensorData, setSensorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Gemini AI Feature ---
    const [selectedCrop, setSelectedCrop] = useState('Rice'); // Default crop
    const [cropAdvice, setCropAdvice] = useState('');
    const [isAdvising, setIsAdvising] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/iot/latest-data/${DEVICE_ID}`);
                setSensorData(response.data);
                setError(null); // Clear previous errors
            } catch (err) {
                setError("Could not fetch sensor data. Is the backend and IoT device running?");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData(); // Fetch immediately on page load
        const intervalId = setInterval(fetchData, 5000); // Refresh every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on exit
    }, []);

    // --- Function to get AI-powered crop advice ---
    const handleGetAdvice = async () => {
        if (!sensorData) return;
        setIsAdvising(true);
        setCropAdvice('');
        try {
            // This calls the backend endpoint we will create next
            const payload = {
                crop_name: selectedCrop,
                soil_moisture: sensorData.soil_moisture,
                temperature: sensorData.temperature,
                humidity: sensorData.humidity
            };
            const response = await axios.post(`${API_BASE_URL}/api/advisor/soil-suggestion`, payload);
            setCropAdvice(response.data.advice);
        } catch (err) {
            setCropAdvice("Could not get AI advice. Please ensure the backend is running and the AI endpoint is configured.");
        } finally {
            setIsAdvising(false);
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-600">Loading live sensor data...</p>;
    }

    if (error || !sensorData) {
        return <p className="text-center text-red-500">{error || "No sensor data available."}</p>;
    }

    return (
        <section>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Soil Moisture Sensor</h1>
                <p className="text-gray-500 mt-2">Live data from your on-field IoT device ({DEVICE_ID})</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cards for sensor data */}
                <div className="bg-white p-6 rounded-xl shadow-lg text-center"><h3 className="text-lg font-semibold text-gray-500 mb-4">Soil Moisture</h3><div className="text-6xl font-bold text-gray-800 my-4">{sensorData.soil_moisture.toFixed(1)}%</div><div className="w-full bg-gray-200 rounded-full h-4"><div className={`h-4 rounded-full ${getMoistureColor(sensorData.soil_moisture)}`} style={{ width: `${sensorData.soil_moisture}%` }}></div></div></div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center"><h3 className="text-lg font-semibold text-gray-500 mb-4">Temperature</h3><div className="text-6xl font-bold text-red-500 my-8">{sensorData.temperature !== null ? sensorData.temperature.toFixed(1) : '--'}°C</div></div>
                <div className="bg-white p-6 rounded-xl shadow-lg text-center"><h3 className="text-lg font-semibold text-gray-500 mb-4">Humidity</h3><div className="text-6xl font-bold text-blue-500 my-8">{sensorData.humidity !== null ? sensorData.humidity.toFixed(1) : '--'}%</div></div>
            </div>
            
            {sensorData.message && <p className="text-center text-yellow-600 mt-8">{sensorData.message}</p>}

            {/* --- AI Advisor UI --- */}
            <div className="mt-12 p-6 bg-gray-100 rounded-lg border max-w-4xl mx-auto">
                 <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">AI Crop Advisor</h3>
                 <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                        <option>Rice</option>
                        <option>Wheat</option>
                        <option>Cotton</option>
                        <option>Sugarcane</option>
                        <option>Potato</option>
                        <option>Tomato</option>
                    </select>
                    <button onClick={handleGetAdvice} disabled={isAdvising} className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-wait transition">
                        {isAdvising ? 'Thinking...' : '✨ Get Advice'}
                    </button>
                 </div>
                 {isAdvising && <p className="text-center text-gray-600 mt-4">Generating advice with Gemini...</p>}
                 {cropAdvice && (
                    <div className="mt-6 p-4 bg-white border-l-4 border-green-500 rounded-r-lg shadow-sm">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{cropAdvice}</div>
                    </div>
                 )}
            </div>
        </section>
    );
}

export default SoilMoisturePage;
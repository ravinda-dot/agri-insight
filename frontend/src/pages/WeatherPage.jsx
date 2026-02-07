import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from '../hooks/useDebounce';

const API_BASE_URL = 'http://127.0.0.1:8000';


const getWeatherInfo = (code) => {
    const weatherMap = { 0: { description: "Clear sky", icon: "☀️" }, 1: { description: "Mainly clear", icon: "🌤️" }, 2: { description: "Partly cloudy", icon: "⛅️" }, 3: { description: "Overcast", icon: "☁️" }, 45: { description: "Fog", icon: "🌫️" }, 48: { description: "Depositing rime fog", icon: "🌫️" }, 51: { description: "Light drizzle", icon: "💧" }, 53: { description: "Moderate drizzle", icon: "💧" }, 55: { description: "Dense drizzle", icon: "💧" }, 61: { description: "Slight rain", icon: "🌧️" }, 63: { description: "Moderate rain", icon: "🌧️" }, 65: { description: "Heavy rain", icon: "🌧️" }, 80: { description: "Slight rain showers", icon: "🌦️" }, 81: { description: "Moderate rain showers", icon: "🌦️" }, 82: { description: "Violent rain showers", icon: "🌦️" }, };
    return weatherMap[code] || { description: "Unknown", icon: "🤷" };
};

function WeatherPage() {
    const [forecast, setForecast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({ name: "Ongole", state: "Andhra Pradesh", lat: 15.5057, lon: 80.0463 });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // --- States for AI Advisor feature ---
    const [selectedCrop, setSelectedCrop] = useState('Rice'); // Default crop
    const [cropAdvice, setCropAdvice] = useState('');
    const [isAdvising, setIsAdvising] = useState(false);

    // Fetch weather when selectedLocation changes
    useEffect(() => {
        if (!selectedLocation) return;
        const fetchWeather = async () => {
            setIsLoading(true); setError(null); setForecast(null); setCropAdvice('');
            try {
                const response = await axios.get(`${API_BASE_URL}/api/weather/?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}`);
                const formattedData = response.data.daily.time.map((date, index) => ({ date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), weather: getWeatherInfo(response.data.daily.weathercode[index]), tempMax: Math.round(response.data.daily.temperature_2m_max[index]), tempMin: Math.round(response.data.daily.temperature_2m_min[index]),}));
                setForecast(formattedData);
            } catch (err) { setError("Could not fetch weather forecast."); } 
            finally { setIsLoading(false); }
        };
        fetchWeather();
    }, [selectedLocation]);

    // Handle location search
    useEffect(() => {
        if (debouncedSearchQuery && debouncedSearchQuery.length > 1) {
            setIsSearching(true);
            axios.get(`${API_BASE_URL}/api/locations/search?q=${debouncedSearchQuery}`)
                .then(response => setSearchResults(response.data))
                .catch(() => setSearchResults([]))
                .finally(() => setIsSearching(false));
        } else { setSearchResults([]); }
    }, [debouncedSearchQuery]);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setSearchQuery('');
        setSearchResults([]);
    };
    
    // --- New function to get AI-powered crop advice ---
    const handleGetAdvice = async () => {
        if (!forecast || !selectedCrop) return;
        setIsAdvising(true);
        setCropAdvice('');
        try {
            const payload = {
                crop_name: selectedCrop,
                weather_data: forecast,
                location_name: `${selectedLocation.name}, ${selectedLocation.state}`
            };
            const response = await axios.post(`${API_BASE_URL}/api/advisor/crop-suggestion`, payload);
            setCropAdvice(response.data.advice);
        } catch (err) {
            setCropAdvice("Sorry, I couldn't get advice at this moment. Please try again.");
        } finally {
            setIsAdvising(false);
        }
    };

    return (
        <section>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Weather Forecast & AI Advisor</h2>
                    <p className="text-gray-500 mb-8">Search for a city to see the 7-day forecast and get crop suggestions.</p>
                </div>

                <div className="relative mb-8 max-w-md mx-auto">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for a city in India..." className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                    {isSearching && <div className="absolute top-3 right-3 h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>}
                    {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((loc, index) => (<li key={index} onClick={() => handleLocationSelect(loc)} className="p-3 hover:bg-blue-50 cursor-pointer">{loc.name}, {loc.state}</li>))}
                        </ul>
                    )}
                </div>
                
                {isLoading && <p className="text-center text-gray-600">Loading forecast...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {forecast && (
                    <>
                        <p className="text-center text-lg font-medium text-gray-700 mb-4">Showing weather for {selectedLocation.name}, {selectedLocation.state}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                            {forecast.map((day, index) => (<div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center"><p className="font-bold text-lg text-gray-800">{day.date.split(',')[0]}</p><p className="text-sm text-gray-500 mb-2">{day.date.split(',')[1]}</p><div className="text-5xl my-3">{day.weather.icon}</div><p className="font-bold text-xl text-gray-900">{day.tempMax}°C</p><p className="text-gray-500">{day.tempMin}°C</p></div>))}
                        </div>

                        {/* --- AI Advisor UI --- */}
                        <div className="mt-6 p-6 bg-gray-100 rounded-lg border">
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
                                    {isAdvising ? 'Thinking...' : '✨ Get Crop Advice'}
                                </button>
                             </div>
                             {isAdvising && <p className="text-center text-gray-600 mt-4">Generating advice with Gemini...</p>}
                             {cropAdvice && (
                                <div className="mt-6 p-4 bg-white border-l-4 border-green-500 rounded-r-lg shadow-sm">
                                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{cropAdvice}</div>
                                </div>
                             )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default WeatherPage;
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';
const GEMINI_API_KEY = "AIzaSyDoUaAB-2fk0pH3qIPrAysUaRO8qBjuktg";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;


function PredictionPage() {
    const [markets, setMarkets] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState('');
    const [selectedCommodity, setSelectedCommodity] = useState('');
    const [prediction, setPrediction] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/locations/all-markets`).then(res => setMarkets(res.data));
        axios.get(`${API_BASE_URL}/api/locations/commodities`).then(res => setCommodities(res.data));
    }, []);

    const handlePredict = () => {
        if (!selectedCommodity || !selectedMarket) { setError("Please select a market and a commodity."); return; }
        setIsLoading(true); setError(null); setPrediction([]); setAnalysis(''); setAnalysisError(null);
        axios.get(`${API_BASE_URL}/api/predict/price?commodity=${selectedCommodity}&market=${selectedMarket}`)
            .then(response => setPrediction(response.data.map(item => ({...item, predicted_price: parseFloat(item.predicted_price)}))))
            .catch(err => setError(err.response?.data?.detail || "Could not fetch prediction."))
            .finally(() => setIsLoading(false));
    };

    const handleAnalyzeForecast = async () => {
        if (prediction.length === 0) return;
        setIsAnalyzing(true); setAnalysis(''); setAnalysisError(null);
        
        const forecastText = prediction.map(p => `Date: ${p.date}, Price: ₹${p.predicted_price.toFixed(2)}`).join('; ');
        const systemPrompt = "You are an expert agricultural market analyst providing advice to farmers in India. Your tone should be simple, encouraging, and direct. Do not use jargon. Format your response using markdown.";
        const userQuery = `Analyze the following 7-day price forecast for ${selectedCommodity} at ${selectedMarket} market. Based on this data, provide a short, bulleted summary of the trend and one piece of practical advice for a farmer. The forecast is: ${forecastText}`;

        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } }),
            });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) setAnalysis(text);
            else throw new Error("Could not get a valid analysis from the AI.");
        } catch (err) {
            setAnalysisError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <section className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Price Prediction</h2>
            <p className="text-gray-500 mb-6">Select a market and crop to get a 7-day forecast.</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <select className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)}><option value="">Select Market</option>{markets.map(m => <option key={m} value={m}>{m}</option>)}</select>
                <select className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" value={selectedCommodity} onChange={(e) => setSelectedCommodity(e.target.value)}><option value="">Select Commodity</option>{commodities.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <button onClick={handlePredict} disabled={isLoading || !selectedMarket || !selectedCommodity} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-300">{isLoading ? 'Generating Forecast...' : 'Generate Forecast'}</button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {prediction.length > 0 && (
                <div className="mt-8">
                    <div className="h-96 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={prediction} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={['dataMin - 100', 'dataMax + 100']} /><Tooltip formatter={(value) => `₹${value.toFixed(2)}`} /><Legend /><Line type="monotone" dataKey="predicted_price" stroke="#2563eb" strokeWidth={2} name={`Predicted Price for ${selectedCommodity} (₹/Quintal)`} /></LineChart></ResponsiveContainer></div>
                    <div className="text-center mt-6"><button onClick={handleAnalyzeForecast} disabled={isAnalyzing} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-wait transition-all duration-300">{isAnalyzing ? 'Analyzing...' : '✨ Analyze Forecast with AI'}</button></div>
                    {isAnalyzing && <p className="text-center text-gray-600 mt-4">Getting insights from Gemini...</p>}
                    {analysisError && <p className="text-red-500 mt-4 text-center">{analysisError}</p>}
                    {analysis && (<div className="mt-6 p-6 bg-indigo-50 border border-indigo-200 rounded-lg"><h3 className="text-xl font-bold text-indigo-900 mb-3">✨ AI-Powered Analysis</h3><div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{analysis}</div></div>)}
                </div>
            )}
        </section>
    );
}

export default PredictionPage;

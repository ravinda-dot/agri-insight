import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

function MarketPricePage() {
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedMarket, setSelectedMarket] = useState('');
    const [prices, setPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { axios.get(`${API_BASE_URL}/api/live-locations/states`).then(res => setStates(res.data)); }, []);

    useEffect(() => {
        if (!selectedState) { setDistricts([]); setMarkets([]); return; }
        axios.get(`${API_BASE_URL}/api/live-locations/districts?state=${selectedState}`).then(res => setDistricts(res.data));
        setSelectedDistrict('');
    }, [selectedState]);

    useEffect(() => {
        if (!selectedDistrict) { setMarkets([]); return; }
        axios.get(`${API_BASE_URL}/api/live-locations/markets?district=${selectedDistrict}`).then(res => setMarkets(res.data));
        setSelectedMarket('');
    }, [selectedDistrict]);

    const handleFetchPrices = () => {
        if (!selectedMarket) return;
        setIsLoading(true); setError(null); setPrices([]);
        axios.get(`${API_BASE_URL}/api/prices/live?state=${selectedState}&district=${selectedDistrict}&market=${selectedMarket}`)
            .then(res => setPrices(res.data))
            .catch(err => setError(err.response?.data?.detail || "Could not fetch prices."))
            .finally(() => setIsLoading(false));
    };

    return (
        <section className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Live Market Prices</h2>
            <p className="text-gray-500 mb-6">Select a location to see the latest commodity prices.</p>
            <div className="grid md:grid-cols-3 gap-4 mb-6 items-center">
                <select className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500" value={selectedState} onChange={e => setSelectedState(e.target.value)}><option value="">Select State</option>{states.map(st => <option key={st} value={st}>{st}</option>)}</select>
                <select className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}><option value="">Select District</option>{districts.map(dist => <option key={dist} value={dist}>{dist}</option>)}</select>
                <select className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500" value={selectedMarket} onChange={e => setSelectedMarket(e.target.value)} disabled={!selectedDistrict}><option value="">Select Market</option>{markets.map(mkt => <option key={mkt} value={mkt}>{mkt}</option>)}</select>
            </div>
            <button onClick={handleFetchPrices} disabled={isLoading || !selectedMarket} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-all duration-300">{isLoading ? 'Fetching...' : 'Fetch Prices'}</button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {prices.length > 0 && (
                <div className="mt-8 overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-gray-100"><tr><th className="p-3 font-bold uppercase text-gray-600 border border-gray-200">Commodity</th><th className="p-3 font-bold uppercase text-gray-600 border border-gray-200">Variety</th><th className="p-3 font-bold uppercase text-gray-600 border border-gray-200">Modal Price (₹/Quintal)</th></tr></thead><tbody>{prices.map((price, index) => (<tr key={index} className="hover:bg-gray-50"><td className="p-3 text-gray-800 border border-gray-200">{price.commodity}</td><td className="p-3 text-gray-800 border border-gray-200">{price.variety}</td><td className="p-3 text-gray-800 font-medium border border-gray-200">{price.modal_price}</td></tr>))}</tbody></table></div>
            )}
        </section>
    );
}

export default MarketPricePage;

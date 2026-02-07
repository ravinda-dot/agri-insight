import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AppLayout = () => (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors">
                    Agri-Insight
                </Link>
                <div className="flex space-x-6">
                     <Link to="/prices" className="text-gray-600 hover:text-green-600 font-medium">Live Prices</Link>
                     <Link to="/predict" className="text-gray-600 hover:text-green-600 font-medium">Prediction</Link>
                </div>
            </nav>
        </header>

        <main className="flex-grow container mx-auto p-6 md:p-8">
            <Outlet /> {/* Your page components (Dashboard, Predict, etc.) will be rendered here */}
        </main>

        <footer className="bg-white border-t mt-8">
            <div className="container mx-auto py-4 px-6 text-center text-gray-500">
                <p>© {new Date().getFullYear()} Agri-Insight Project. All rights reserved.</p>
            </div>
        </footer>
    </div>
);

export default AppLayout;
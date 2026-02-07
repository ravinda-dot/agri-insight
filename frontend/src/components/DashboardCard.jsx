import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ to, icon, title, disabled = false }) => {
    const content = (
        <>
            {icon}
            <span className="mt-4 text-lg font-semibold text-gray-700">{title}</span>
            {disabled && <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">Soon</span>}
        </>
    );

    if (disabled) {
        return <div className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition hover:shadow-xl opacity-50 cursor-not-allowed">{content}</div>;
    }

    return <Link to={to} className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition hover:shadow-2xl hover:-translate-y-1">{content}</Link>;
};

export default DashboardCard;
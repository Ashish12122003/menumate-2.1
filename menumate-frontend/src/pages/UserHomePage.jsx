// src/pages/UserHomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUtensils } from 'react-icons/fa';
import BottomNavBar from '../components/organisms/BottomNavBar';
import { useSelector } from 'react-redux';

const SHOP_NAME = "Brewer's Cafe";
const SHOP_LOGO = "☕";

const UserHomePage = () => {
    const { qrIdentifier } = useSelector((state) => state.menu);

    // Use Redux qrIdentifier if available; fallback to test ID
    const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : '/menu/test-shop-qr-12345';

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
            <div className="flex-grow flex flex-col items-center justify-center p-8">
                
                <div className="text-6xl mb-4">{SHOP_LOGO}</div>
                <h1 className="text-4xl font-bold text-secondary mb-2">{SHOP_NAME}</h1>
                <p className="text-lg text-gray-500 mb-10">Scan. Order. Enjoy.</p>
                
                <Link
                    to={menuUrl}
                    className="bg-primary text-black text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-orange-700 transition-all flex items-center space-x-3"
                >
                    <FaUtensils className="mr-2" />
                    <span>View Menu</span>
                    <FaArrowRight size={14} />
                </Link>

            </div>
            
            <BottomNavBar />
        </div>
    );
};

export default UserHomePage;

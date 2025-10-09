// src/pages/UserHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUtensils } from 'react-icons/fa';
import BottomNavBar from '../components/organisms/BottomNavBar';
import { useSelector } from 'react-redux';

const UserHomePage = () => {
  const { qrIdentifier, shop, shops } = useSelector((state) => state.menu);

  const shopName = shop?.name || shops?.[0]?.name || "MenuMate";
  const shopLogo = shop?.logo || ""; // fallback icon

  const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : '/menu/test-shop-qr-12345';

  return (
    <div className="bg-gradient-to-b from-[#211B14] to-[#110D09] text-gray-200 min-h-screen flex flex-col justify-between pb-24">
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 sm:px-12">
        
        <div className="text-8xl mb-6">{shopLogo}</div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-amber-400 mb-3 text-center">
          {shopName}
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 mb-10 text-center">
          Scan. Order. Enjoy.
        </p>
        
        <Link
          to={menuUrl}
          className="bg-amber-500 text-black text-lg sm:text-xl font-bold py-3 px-8 rounded-full shadow-lg hover:bg-amber-600 transition-all flex items-center space-x-3"
        >
          
          <span>View Menu</span>
          <FaArrowRight size={16} />
        </Link>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default UserHomePage;

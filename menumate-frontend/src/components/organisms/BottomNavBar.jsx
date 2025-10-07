// src/components/organisms/BottomNavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaClipboardList, FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// NavItem component
const NavItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center p-1 transition-colors ${
        isActive ? 'text-primary' : 'text-gray-500 hover:text-secondary'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-medium mt-0.5">{label}</span>
    </Link>
  );
};

// Bottom navigation bar
const BottomNavBar = () => {
  const location = useLocation();
  const { qrIdentifier , shop , shops } = useSelector((state) => state.menu);

  // Determine shopId for reviews
  const shopId = shop?._id || (shops?.[0]?._id) || null;
  // Dynamic menu URL
  const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : '/';
  const reviewsUrl = shopId ? `/reviews/${shopId}` : '/reviews';

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-50">
      <div className="max-w-xl mx-auto flex justify-around items-center h-16">
        {/* 1. Home Page */}
        <NavItem
          to="/"
          icon={FaHome}
          label="Home"
          isActive={location.pathname === '/'}
        />

        {/* 2. Menu Page */}
        <NavItem
          to={menuUrl}
          icon={FaUtensils}
          label="Menu"
          isActive={location.pathname.startsWith('/menu')}
        />

        {/* 3. Orders/Status Page */}
        <NavItem
          to="/orders"
          icon={FaClipboardList}
          label="Orders"
          isActive={
            location.pathname === '/orders' || location.pathname.startsWith('/orders/')
          }
        />

        {/* 4. Reviews Page */}
        <NavItem
          to={reviewsUrl}
          icon={FaStar}
          label="Reviews"
          isActive={location.pathname.startsWith('/reviews/')}
        />
      </div>
    </footer>
  );
};

export default BottomNavBar;

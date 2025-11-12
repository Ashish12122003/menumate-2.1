// src/pages/UserHomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaUtensils } from "react-icons/fa";
import BottomNavBar from "../components/organisms/BottomNavBar";
import { useSelector } from "react-redux";

const UserHomePage = () => {
  const { qrIdentifier, shop, shops } = useSelector((state) => state.menu);

  const shopName = shop?.name || shops?.[0]?.name || "MenuMate";
  const shopLogo = shop?.logo || ""; // fallback icon

  const menuUrl = qrIdentifier
    ? `/menu/${qrIdentifier}`
    : "/menu/test-shop-qr-12345";

  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col justify-between pb-24">
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 sm:px-12 text-center">
        {/* Shop Logo or Icon */}
        <div className="mb-6 text-[#B4161B]">
          {shopLogo ? (
            <img
              src={shopLogo}
              alt={`${shopName} Logo`}
              className="w-28 h-28 object-contain mx-auto rounded-full shadow-md border border-gray-200"
            />
          ) : (
            <FaUtensils size={80} className="mx-auto text-[#B4161B]" />
          )}
        </div>

        {/* Shop Name */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#B4161B] mb-3">
          {shopName}
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          Scan. Order. Enjoy.
        </p>

        {/* CTA Button */}
        <Link
          to={menuUrl}
          className="bg-[#B4161B] hover:bg-[#D92A2A] text-white text-lg sm:text-xl font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-3"
        >
          <span>View Menu</span>
          <FaArrowRight size={16} />
        </Link>
      </div>

      {/* Footer Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default UserHomePage;

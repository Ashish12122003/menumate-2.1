// src/components/organisms/BottomNavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUtensils, FaClipboardList, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const NavItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-1.5 transition-all duration-300 ${
        isActive
          ? "text-amber-400 scale-105 "
          : "text-gray-400 hover:text-amber-300 hover:scale-105"
      }`}
    >
      <Icon size={17} />
      <span className="text-[10px] font-medium mt-0.5">{label}</span>
    </Link>
  );
};

const BottomNavBar = () => {
  const location = useLocation();
  const { qrIdentifier, shop, shops } = useSelector((state) => state.menu);

  const shopId = shop?._id || shops?.[0]?._id || null;
  const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : "/";
  const reviewsUrl = shopId ? `/reviews/${shopId}` : "/reviews";

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#1a1a1a] to-[#262626] border-t border-[#2e2e2e] backdrop-blur-lg z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.4)]">
      <div className="max-w-lg mx-auto flex justify-around items-center h-12 sm:h-14 px-2">
        <NavItem
          to="/"
          icon={FaHome}
          label="Home"
          isActive={location.pathname === "/"}
        />

        <NavItem
          to={menuUrl}
          icon={FaUtensils}
          label="Menu"
          isActive={location.pathname.startsWith("/menu")}
        />

        <NavItem
          to="/orders"
          icon={FaClipboardList}
          label="Orders"
          isActive={
            location.pathname === "/orders" ||
            location.pathname.startsWith("/orders/")
          }
        />

        <NavItem
          to={reviewsUrl}
          icon={FaStar}
          label="Reviews"
          isActive={location.pathname.startsWith("/reviews/")}
        />
      </div>
    </footer>
  );
};

export default BottomNavBar;

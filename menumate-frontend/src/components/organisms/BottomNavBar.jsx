// src/components/organisms/BottomNavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUtensils, FaClipboardList, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const NavItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ${
        isActive
          ? "text-white scale-105"
          : "text-red-100 hover:text-white hover:scale-105"
      }`}
    >
      <Icon size={18} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
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
    <footer className="fixed bottom-0 left-0 w-full bg-[#B4161B] border-t border-[#B4161B] shadow-[0_-2px_12px_rgba(180,22,27,0.3)] z-50 rounded-t-2xl">
      <div className="max-w-lg mx-auto flex justify-around items-center h-14 sm:h-16 px-3">
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

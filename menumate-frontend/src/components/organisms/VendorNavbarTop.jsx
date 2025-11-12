import React from "react";
import { Link, useLocation } from "react-router-dom";

const VendorNavbarTop = ({ hideTabs = [] }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { name: "Dashboard", icon: "dashboard", path: "/vendor/dashboard" },
    { name: "Menu", icon: "menu_book", path: "/vendor/manage-shops?tab=menu" },
    { name: "Orders", icon: "receipt_long", path: "/vendor/manage-shops" },
    { name: "Analytics", icon: "bar_chart", path: "/vendor/manage-shops?tab=analytics" },
    { name: "Reviews", icon: "star", path: "/vendor/reviews" },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !hideTabs.includes(link.name)
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-[#6F4E37] rounded-lg p-2">
            <span className="material-symbols-outlined text-white text-lg">
              restaurant_menu
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#6F4E37]">MenuMate</h1>
            <p className="text-xs text-[#2F4F4F]/70">Vendor Panel</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {visibleLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-1 text-sm font-medium transition ${
                currentPath.includes(link.path.split("?")[0])
                  ? "text-[#6F4E37] border-b-2 border-[#6F4E37]"
                  : "text-gray-600 hover:text-[#6F4E37]"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile + Settings */}
        <div className="flex items-center gap-4">
          <Link
            to="/vendor/settings"
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#6F4E37]"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            Settings
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#2F4F4F]/70">Shop Owner</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbarTop;

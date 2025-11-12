import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutVendorUser } from "../../features/vendor/vendorAuthSlice";

const VendorNavbar = ({ shopName = "Your Shop" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { vendor } = useSelector((state) => state.vendorAuth);

  const handleLogout = () => {
    dispatch(logoutVendorUser());
    navigate("/vendor/login", { replace: true });
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* ---------- LEFT SECTION (Logo + Shop Info) ---------- */}
        <div className="flex items-center gap-4">
          <img
            src="/MENUMATE real logo.png"
            alt="MenuMate Logo"
            className="w-10 h-10 rounded-md"
          />
          <div>
            <h1 className="text-xl font-bold text-[#B4161B]">{shopName}</h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`mt-1 px-3 py-0.5 rounded-full text-xs font-semibold transition-all ${
                isOpen
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {isOpen ? "🟢 Open" : "🔴 Closed"}
            </button>
          </div>
        </div>

        {/* ---------- RIGHT SECTION ---------- */}
        <div className="flex items-center gap-4">
          {/* --- Notifications Button --- */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-[#B4161B] text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-[#D92A2A] transition"
            >
              🔔 Notifications
              <span className="absolute -top-1 -right-2 bg-white text-[#B4161B] font-bold text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg p-3 z-50">
                <h3 className="text-base font-semibold border-b pb-2 mb-2 text-[#B4161B]">
                  Recent Alerts
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="bg-gray-50 p-2 rounded-lg">
                    🧾 New order from <strong>Table 12</strong>
                  </li>
                  <li className="bg-gray-50 p-2 rounded-lg">
                    🍽️ Waiter call from <strong>Table 5</strong>
                  </li>
                  <li className="bg-gray-50 p-2 rounded-lg">
                    💬 Review received from <strong>Table 9</strong>
                  </li>
                </ul>
                <button className="mt-3 text-sm text-[#B4161B] font-medium hover:underline">
                  View all →
                </button>
              </div>
            )}
          </div>

          {/* --- Manage Shops --- */}
          <Link
            to="/vendor/manage-shops"
            className="bg-[#FFF0F0] text-[#B4161B] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#FFEAEA] transition"
          >
            🏪 Manage Shops
          </Link>

          {/* --- KOT Display --- */}
          <Link
            to="/vendor/kot-display"
            className="bg-[#B4161B] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#D92A2A] transition"
          >
            🧾 KOT Display
          </Link>

          {/* --- Profile Dropdown --- */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-[#FFF0F0] text-[#B4161B] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#FFEAEA] transition"
            >
              👤 {vendor?.name || "Profile"}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg p-2 z-50">
                <Link
                  to="/vendor/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  ⚙️ Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbar;

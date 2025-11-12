import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutAdminUser,
  fetchAdminProfile,
} from "../../features/admin/adminAuthSlice";
import FoodCourtManagement from "../../components/organisms/FoodCourtManagement";
import VendorApproval from "../../components/organisms/VendorApproval";
import TableManagement from "../../components/organisms/TableManagement";
import { fetchMyShops, setSelectedShop } from "../../features/vendor/shopSlice";

const AdminDashboardPage = () => {
  const { admin, loading, isAuthenticated } = useSelector(
    (state) => state.adminAuth
  );
  const { shops, selectedShop } = useSelector((state) => state.shops);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("foodCourts");

  useEffect(() => {
    if (isAuthenticated && !admin) dispatch(fetchAdminProfile());
    dispatch(fetchMyShops());
  }, [dispatch, isAuthenticated, admin]);

  useEffect(() => {
    if (!selectedShop && shops.length > 0) {
      dispatch(setSelectedShop(shops[0]));
    }
  }, [dispatch, shops, selectedShop]);

  const handleLogout = () => {
    dispatch(logoutAdminUser());
    navigate("/admin/login", { replace: true });
  };

  const handleShopChange = (e) => {
    const shop = shops.find((s) => s._id === e.target.value);
    dispatch(setSelectedShop(shop));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading admin data...
        </p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold text-lg">
          No admin data available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5f5] to-[#fffafa]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 shadow-md bg-white border-b border-[#B4161B]/10">
        <h1 className="text-2xl md:text-3xl font-bold text-[#B4161B]">
          MenuMate Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-[#B4161B] hover:bg-[#D92A2A] text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all"
        >
          Logout
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex justify-center space-x-10 border-b border-gray-200 bg-white py-3">
        {[
          { key: "foodCourts", label: "Food Courts" },
          { key: "vendorApproval", label: "Vendor Approval" },
          { key: "tables", label: "Tables & QR" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-lg font-semibold transition-all ${
              activeTab === tab.key
                ? "text-[#B4161B] border-b-4 border-[#B4161B]"
                : "text-gray-500 hover:text-[#B4161B]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Shop Selector (for Tables tab) */}
        {activeTab === "tables" && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Select a Shop
            </h2>
            <select
              onChange={handleShopChange}
              value={selectedShop?._id || ""}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#B4161B]/70 outline-none"
            >
              <option value="">Select Shop</option>
              {(shops || []).map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tabs Content */}
        <div className="bg-white rounded-xl shadow-lg border border-[#B4161B]/10 p-6">
          {activeTab === "foodCourts" && <FoodCourtManagement />}
          {activeTab === "vendorApproval" && <VendorApproval />}
          {activeTab === "tables" && selectedShop && (
            <TableManagement shopId={selectedShop._id} />
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6 border-t border-gray-100">
        © {new Date().getFullYear()} MenuMate Admin Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboardPage;

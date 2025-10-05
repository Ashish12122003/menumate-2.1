// src/pages/admin/AdminDashboardPage.jsx

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
    if (isAuthenticated && !admin) {
      dispatch(fetchAdminProfile());
    }
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
          No admin data available
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="border border-green-900 bg-green-900 px-8 py-2 rounded-full text-3xl font-bold text-white">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("foodCourts")}
          className={`pb-2 font-semibold transition-colors ${
            activeTab === "foodCourts"
              ? "text-green-900 border-b-3 border-green-900"
              : "text-gray-500 hover:text-green-900"
          }`}
        >
          Food Courts
        </button>
        <button
          onClick={() => setActiveTab("vendorApproval")}
          className={`pb-2 font-semibold transition-colors ${
            activeTab === "vendorApproval"
              ? "text-green-900 border-b-3 border-green-900"
              : "text-gray-500 hover:text-green-900"
          }`}
        >
          Vendor Approval
        </button>
        <button
          onClick={() => setActiveTab("tables")}
          className={`pb-2 font-semibold transition-colors ${
            activeTab === "tables"
              ? "text-green-900 border-b-3 border-green-900"
              : "text-gray-500 hover:text-green-900"
          }`}
        >
          Tables & QR
        </button>
      </div>

      {/* Shop Selector (only for tables tab) */}
      {activeTab === "tables" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Select a Shop
          </h2>
          <select
            onChange={handleShopChange}
            value={selectedShop?._id || ""}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-50 outline-none"
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
      <div className="bg-white shadow-lg rounded-xl p-6">
        {activeTab === "foodCourts" && <FoodCourtManagement />}
        {activeTab === "vendorApproval" && <VendorApproval />}
        {activeTab === "tables" && selectedShop && <TableManagement shopId={selectedShop._id}/>}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

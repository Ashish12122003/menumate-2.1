// src/pages/vendor/ShopManagementPage.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyShops,
  setSelectedShop,
  fetchShopData,
} from "../../features/vendor/shopSlice";
import OrderDashboard from "../../components/organisms/OrderDashboard";
import MenuManagement from "../../components/organisms/MenuManagement";
import CreateShopForm from "../../components/molecules/CreateShopForm";
import POSDashboard from "../../components/organisms/POSDashboard"; // NEW IMPORT

const ShopManagementPage = () => {
  const dispatch = useDispatch();
  const { shops, selectedShop, loading, error } = useSelector(
    (state) => state.shops
  );
  // Initialize activeTab to 'orders' or 'analytics' as the default view
  const [activeTab, setActiveTab] = useState("orders"); 

  useEffect(() => {
    dispatch(fetchMyShops());
  }, [dispatch]);

  useEffect(() => {
    // FIX: Automatically set the first shop as selected if shops are loaded and none is selected
    if (!selectedShop && shops.length > 0) {
      dispatch(setSelectedShop(shops[0]));
    }
    
    // Fetch detailed shop data (menu/categories) only when a shop is truly selected
    if (selectedShop) {
      dispatch(fetchShopData(selectedShop._id));
    }
  }, [dispatch, shops, selectedShop]);

  const handleShopChange = (e) => {
    const shop = (shops || []).find((s) => s._id === e.target.value);
    dispatch(setSelectedShop(shop));
    // Optional: Reset active tab to Orders/Analytics when shop changes
    // setActiveTab('orders'); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 animate-pulse text-lg">
          Loading your shops...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!shops || shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-xl text-gray-600 mb-6 text-center">
          You don’t have any shops yet. Create one to get started 🚀
        </p>
        <div className="w-full max-w-lg">
          <CreateShopForm />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Shop Management
        </h1>
        <select
          onChange={handleShopChange}
          value={selectedShop?._id || ""}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-green-900 focus:border-green-900"
        >
          {/* Ensure a null/empty option is not shown if selectedShop is null */}
          {(shops || []).map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {selectedShop && (
        <div>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            
            {/* Orders Tab */}
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "border-b-2 border-green-900 text-green-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Orders
            </button>
            
            {/* Menu Management Tab */}
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === "menu"
                  ? "border-b-2 border-green-900 text-green-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Menu Management
            </button>

            {/* NEW: Analytics Tab */}
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === "analytics"
                  ? "border-b-2 border-green-900 text-green-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white shadow-md rounded-xl p-6">
            {activeTab === "orders" && (
              <OrderDashboard shopId={selectedShop._id} />
            )}
            {activeTab === "menu" && (
              <MenuManagement shopId={selectedShop._id} />
            )}
            {/* NEW: POS/Analytics Dashboard Content */}
            {activeTab === "analytics" && (
              <POSDashboard shopId={selectedShop._id} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManagementPage;
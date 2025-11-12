import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchMyShops,
  setSelectedShop,
  fetchShopData,
} from "../../features/vendor/shopSlice";
import OrderDashboard from "../../components/organisms/OrderDashboard";
import MenuManagement from "../../components/organisms/MenuManagement";
import CreateShopForm from "../../components/molecules/CreateShopForm";
import POSDashboard from "../../components/organisms/POSDashboard";
import VendorNavbarTop from "../../components/organisms/VendorNavbarTop";

const ShopManagementPage = () => {
  const dispatch = useDispatch();
  const { shops, selectedShop, loading, error } = useSelector(
    (state) => state.shops
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get("tab");
  const [activeTab, setActiveTab] = useState(defaultTab || "orders");

  useEffect(() => {
    dispatch(fetchMyShops());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedShop && shops.length > 0) {
      dispatch(setSelectedShop(shops[0]));
    }
    if (selectedShop) {
      dispatch(fetchShopData(selectedShop._id));
    }
  }, [dispatch, shops, selectedShop]);

  useEffect(() => {
    if (activeTab) localStorage.setItem("vendor-active-tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const savedTab = localStorage.getItem("vendor-active-tab");
    if (!defaultTab && savedTab) setActiveTab(savedTab);
  }, []);

  const handleShopChange = (e) => {
    const shop = (shops || []).find((s) => s._id === e.target.value);
    dispatch(setSelectedShop(shop));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F7F4]">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Loading your shops...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F7F4] text-red-600 font-semibold">
        <p>Error: {error}</p>
      </div>
    );

  if (!shops || shops.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F7F4] px-4">
        <p className="text-xl text-gray-700 mb-6 text-center">
          You don’t have any shops yet. Create one to get started 🚀
        </p>
        <div className="w-full max-w-lg">
          <CreateShopForm />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      {/* ✅ Top Navbar (hide duplicates) */}
      <VendorNavbarTop hideTabs={["Menu", "Orders", "Analytics"]} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#6F4E37]">
            Shop Management
          </h1>

          <select
            onChange={handleShopChange}
            value={selectedShop?._id || ""}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-[#6F4E37] focus:border-[#6F4E37] bg-white text-gray-700"
          >
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
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "orders"
                    ? "border-b-2 border-[#6F4E37] text-[#6F4E37]"
                    : "text-gray-500 hover:text-[#6F4E37]"
                }`}
              >
                Orders
              </button>

              <button
                onClick={() => setActiveTab("menu")}
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "menu"
                    ? "border-b-2 border-[#6F4E37] text-[#6F4E37]"
                    : "text-gray-500 hover:text-[#6F4E37]"
                }`}
              >
                Menu Management
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  activeTab === "analytics"
                    ? "border-b-2 border-[#6F4E37] text-[#6F4E37]"
                    : "text-gray-500 hover:text-[#6F4E37]"
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
              {activeTab === "orders" && (
                <OrderDashboard shopId={selectedShop._id} />
              )}
              {activeTab === "menu" && (
                <MenuManagement shopId={selectedShop._id} />
              )}
              {activeTab === "analytics" && (
                <POSDashboard shopId={selectedShop._id} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopManagementPage;

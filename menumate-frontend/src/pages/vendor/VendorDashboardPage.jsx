// src/pages/vendor/VendorDashboardPage.jsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  logoutVendorUser,
  fetchVendorProfile,
} from "../../features/vendor/vendorAuthSlice";
import {
  fetchMyShops,
  fetchShopAnalytics,
} from "../../features/vendor/shopSlice";
import {
  fetchOrdersForShop,
} from "../../features/vendor/orderSlice"; // ✅ imported order logic

import useVendorWebSocket from "../../hooks/useVendorWebSocket"; // ✅ optional if you want live updates

const VendorDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vendor, loading, isAuthenticated } = useSelector(
    (state) => state.vendorAuth
  );
  const { shops, analytics, loading: shopsLoading, error } = useSelector(
    (state) => state.shops
  );

  const { orders = [], loading: orderLoading } = useSelector(
    (state) => state.vendorOrder
  );

  const [duration] = useState("day");

  // Initialize WebSocket for live updates (if available)
  const shopId = shops[0]?._id;
  useVendorWebSocket(shopId);

  // Fetch vendor profile
  useEffect(() => {
    if (isAuthenticated && !vendor) {
      dispatch(fetchVendorProfile());
    }
  }, [dispatch, isAuthenticated, vendor]);

  // Fetch vendor's shops
  useEffect(() => {
    if (vendor) {
      dispatch(fetchMyShops());
    }
  }, [dispatch, vendor]);

  // Fetch analytics and live orders once shop is loaded
  useEffect(() => {
    if (shops.length > 0) {
      const currentShopId = shops[0]._id;
      dispatch(fetchShopAnalytics({ shopId: currentShopId, duration }));
      dispatch(fetchOrdersForShop(currentShopId));
    }
  }, [dispatch, shops, duration]);

  const handleLogout = () => {
    dispatch(logoutVendorUser());
    navigate("/vendor/login", { replace: true });
  };

  // Handle loading and errors
  if (loading || shopsLoading || analytics.loading || orderLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F7F4]">
        <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F7F4]">
        <p className="text-red-500 font-medium">No vendor data found</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F7F4]">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  // Extract analytics data
  const data = analytics.data || {};
  const totalRevenue = data.totalRevenue || 0;
  const totalOrders = data.totalOrders || 0;

  // ✅ Compute real-time pending orders directly from Redux
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending"
  ).length;

  return (
    <div className="font-[Plus Jakarta Sans] text-[#2F4F4F] bg-[#F8F7F4] flex min-h-screen">
      {/* -------- Sidebar -------- */}
      <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white border-r border-[#EAE8E2] p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#6F4E37] rounded-lg p-2">
            <span className="material-symbols-outlined text-white">
              restaurant_menu
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold">MenuMate</h1>
            <p className="text-xs text-[#2F4F4F]/70">Vendor Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link
            to="/vendor/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#6F4E37]/10 text-[#6F4E37] font-semibold"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm">Dashboard</p>
          </Link>

          <Link
            to="/vendor/manage-shops?tab=menu"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#6F4E37]/10 transition"
          >
            <span className="material-symbols-outlined">menu_book</span>
            <p className="text-sm">Menu</p>
          </Link>

          <Link
            to="/vendor/manage-shops"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#6F4E37]/10 transition"
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <p className="text-sm">Orders</p>
          </Link>

          <Link
            to="/vendor/manage-shops?tab=analytics"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#6F4E37]/10 transition"
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <p className="text-sm">Analytics</p>
          </Link>

          <Link
            to="/vendor/reviews"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#6F4E37]/10 transition"
          >
            <span className="material-symbols-outlined">star</span>
            <p className="text-sm">Reviews</p>
          </Link>
        </nav>

        {/* Footer */}
        <div className="mt-auto">
          <Link
            to="/vendor/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#6F4E37]/10 transition"
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium">Settings</p>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg hover:bg-[#6F4E37]/10 transition">
            <div
              className="w-8 h-8 rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/736x/41/69/ea/4169ea4043c2be54e5c25e9ef154cfdf.jpg')",
              }}
            ></div>
            <div>
              <p className="text-sm font-semibold">{vendor?.name}</p>
              <p className="text-xs text-[#2F4F4F]/70">Shop Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* -------- Main Content -------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {vendor.name || "Vendor"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/vendor/manage-shops"
              className="flex items-center justify-center gap-x-2 rounded-md bg-[#A8D5BA] text-[#2F4F4F] px-4 py-2 text-sm font-semibold"
            >
              <span className="material-symbols-outlined">storefront</span>
              Manage Shops
            </Link>
            <Link
              to="/vendor/kot-display"
              className="flex items-center justify-center gap-x-2 rounded-md bg-white border border-[#EAE8E2] px-4 py-2 text-sm font-medium hover:bg-[#6F4E37]/5"
            >
              <span className="material-symbols-outlined">receipt</span>
              KOT Display
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-x-2 rounded-md bg-[#FF7F50] text-white px-4 py-2 text-sm font-semibold hover:bg-[#E85C37]"
            >
              Logout
            </button>
          </div>
        </header>

        {/* -------- Live Analytics Cards -------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-[#EAE8E2] shadow-sm hover:shadow-md transition-all">
            <p className="text-base font-medium text-[#2F4F4F]/80">
              Today’s Orders
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-[#6F4E37]">
              {totalOrders}
            </p>
          </div>

          <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border-2 border-[#FF7F50] shadow-sm hover:shadow-md transition-all">
            <p className="text-base font-medium text-[#2F4F4F]/80">
              Total Revenue
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-[#FF7F50]">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </div>

          {/* ✅ Live Pending Orders */}
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-[#EAE8E2] shadow-sm hover:shadow-md transition-all">
            <p className="text-base font-medium text-[#2F4F4F]/80">
              Pending Orders
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-[#A0522D]">
              {pendingOrders}
            </p>
          </div>
        </div>

        {/* -------- Vendor & Shop Info -------- */}
        <div className="rounded-xl border border-[#EAE8E2] bg-white p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Info</h2>
              <p className="text-sm">Email: {vendor.email}</p>
              <p className="text-sm mt-1">Role: Shop Owner</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Shops</h2>
              {shops.length > 0 ? (
                <div className="border border-[#EAE8E2] rounded-lg p-3 flex justify-between items-center">
                  <span className="font-medium">{shops[0].name}</span>
                  <span className="text-xs font-medium bg-[#A8D5BA]/30 text-[#059669] px-2 py-1 rounded-full">
                    Approved
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shops available.</p>
              )}
              <Link
                to="/vendor/manage-shops"
                className="text-sm text-[#FF7F50] font-medium mt-3 inline-block hover:underline"
              >
                View all shops →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardPage;

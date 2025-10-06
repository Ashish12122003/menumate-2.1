// src/pages/vendor/VendorDashboardPage.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  logoutVendorUser,
  fetchVendorProfile,
} from "../../features/vendor/vendorAuthSlice";
import { fetchMyShops } from "../../features/vendor/shopSlice";

const VendorDashboardPage = () => {
  const { vendor, loading, isAuthenticated } = useSelector(
    (state) => state.vendorAuth
  );
  const { shops, loading: shopsLoading, error } = useSelector(
    (state) => state.shops
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !vendor) {
      dispatch(fetchVendorProfile());
    }
  }, [dispatch, isAuthenticated, vendor]);

  useEffect(() => {
    if (vendor) {
      dispatch(fetchMyShops());
    }
  }, [dispatch, vendor]);

  const handleLogout = () => {
    dispatch(logoutVendorUser());
    navigate("/vendor/login", { replace: true });
  };

  if (loading || shopsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading vendor data...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium">No vendor data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, <span className="text-green-900">{vendor.name}</span>
          </h1>
          <div className="flex gap-3">
            <Link
              to="/vendor/manage-shops"
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-900 text-white hover:bg-green-800 transition"
            >
              Manage Shops
            </Link>

            <Link
              to="/vendor/kot-display"
              className="px-5 py-2 rounded-lg text-sm font-medium bg-green-900 text-white hover:bg-green-800 transition"
            >
              KOT Display
            </Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-400 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="bg-orange-50 border border-orange-300 rounded-2xl shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Info</h2>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {vendor.email}
          </p>

          {error && <p className="text-red-500">{error}</p>}

          {shops.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Your Shops
              </h3>
              <ul className="bg-white divide-y divide-gray-100 border rounded-xl overflow-hidden">
                {shops.slice(0, 2).map((shop) => (
                  <li
                    key={shop._id}
                    className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-800">
                      {shop.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {shop.status || "Active"}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/vendor/manage-shops"
                className="inline-block mt-3 text-sm font-medium text-green-900 hover:underline"
              >
                View all shops →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">
              You have no shops yet. Please create one to manage your menu and
              orders.
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-orange-300  rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            <h3 className="text-sm font-medium text-black">Today’s Orders</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">12</p>
          </div>
          <div className="bg-white border border-orange-300 rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            <h3 className="text-sm font-medium text-black">Revenue</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">₹5,400</p>
          </div>
          <div className="bg-white border border-orange-300  rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            <h3 className="text-sm font-medium text-black">
              Pending Orders
            </h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;

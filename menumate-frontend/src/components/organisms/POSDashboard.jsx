// src/components/organisms/POSDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopAnalytics } from "../../features/vendor/shopSlice";
import {
  FaChartLine,
  FaUsers,
  FaTable,
  FaStar,
  FaRupeeSign,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import CustomChart from "../molecules/CustomChart";

const durationOptions = [
  { label: "Today", value: "day" },
  { label: "Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "3 Months", value: "3month" },
  { label: "6 Months", value: "6month" },
  { label: "Custom", value: "custom" },
];

const colors = ["#4ade80", "#60a5fa", "#facc15", "#f472b6", "#a78bfa"];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-4 rounded-xl shadow-lg ${color} text-white flex flex-col justify-between`}>
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium">{title}</h3>
      <Icon size={20} />
    </div>
    <p className="text-3xl font-extrabold mt-3">{value}</p>
  </div>
);

const POSDashboard = ({ shopId }) => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.shops);
  const [duration, setDuration] = useState("day");
  const data = analytics.data || {};
  const isLoading = analytics.loading;
  const [showRepeat, setShowRepeat] = useState(false);
  const [showAllCustomers, setShowAllCustomers] = useState(false);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchShopAnalytics({ shopId, duration }));
    }
  }, [dispatch, shopId, duration]);

  if (isLoading) return <p className="text-center p-8">Loading analytics data...</p>;
  if (analytics.error) return <p className="text-center p-8 text-red-500">Error: {analytics.error}</p>;

  // Prepare pie chart data for top items
  const itemsPie = [
    data.mostFavItem ? { name: data.mostFavItem.name, value: data.mostFavItem.count } : null,
    data.leastFavItem ? { name: data.leastFavItem.name, value: data.leastFavItem.count } : null,
  ].filter(Boolean);

  // Prepare pie chart data for top tables
  const tablesPie = (data.topTables || []).map((t) => ({
    name: `Table ${t.tableNumber}`,
    value: t.orderCount,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary">POS & Analytics Dashboard</h2>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="p-2 border rounded-lg bg-white shadow-sm focus:ring-primary focus:border-primary"
        >
          {durationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${(data.totalRevenue || 0).toFixed(2)}`}
          icon={FaRupeeSign}
          color="bg-green-600"
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders || 0}
          icon={FaClipboardList}
          color="bg-blue-600"
        />
        <StatCard
          title="Repeat Customers"
          value={data.repeatCustomersCount || 0}
          icon={FaUsers}
          color="bg-yellow-600"
        />
        <StatCard
          title="Avg. Rating"
          value={(data.averageRating || 0).toFixed(1)}
          icon={FaStar}
          color="bg-purple-600"
        />
      </div>

      {/* Item Performance Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaChartLine />
            <span>Item Performance</span>
          </h3>
          {itemsPie.length > 0 ? (
            <CustomChart type="pie" data={itemsPie} dataKey="value" nameKey="name" colors={colors} height={250} />
          ) : (
            <p className="text-center text-gray-500">No item data available</p>
          )}
        </div>

        {/* Top Tables Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaTable />
            <span>Top Tables</span>
          </h3>
          {tablesPie.length > 0 ? (
            <CustomChart type="pie" data={tablesPie} dataKey="value" nameKey="name" colors={colors} height={250} />
          ) : (
            <p className="text-center text-gray-500">No table data available</p>
          )}

          {/* Top tables list */}
          <ul className="mt-4 space-y-2">
            {(data.topTables || []).map((table, idx) => (
              <li key={idx} className="flex justify-between text-gray-700">
                <span className="font-medium">Table {table.tableNumber}</span>
                <span className="text-primary font-bold">{table.orderCount} orders</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Base */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaUsers />
            <span>Customer Base</span>
          </h3>
          <p className="flex justify-between">
            <span className="font-medium text-gray-700">Total Customers:</span>
            <span className="font-bold text-blue-700">{data.totalCustomers || 0}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-700">Repeat Customers:</span>
            <span className="font-bold text-yellow-700">{data.repeatCustomersCount || 0}</span>
          </p>
        </div>
      </div>

      {/* Repeat Customers Table */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowRepeat(!showRepeat)}>
          <h3 className="text-xl font-bold text-gray-800">🔁 Repeat Customers List</h3>
          {showRepeat ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {showRepeat && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-right">Orders</th>
                </tr>
              </thead>
              <tbody>
                {(data.repeatCustomers || []).map((cust, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{cust.name}</td>
                    <td className="p-2">{cust.email}</td>
                    <td className="p-2">{cust.phone}</td>
                    <td className="p-2 text-right font-semibold">{cust.orderCount}</td>
                  </tr>
                ))}
                {(!data.repeatCustomers || data.repeatCustomers.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">No repeat customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Customers Table */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowAllCustomers(!showAllCustomers)}>
          <h3 className="text-xl font-bold text-gray-800">👥 All Customers List</h3>
          {showAllCustomers ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {showAllCustomers && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(data.allCustomers || []).map((cust, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{cust.name}</td>
                    <td className="p-2">{cust.email}</td>
                    <td className="p-2">{cust.phone}</td>
                    <td className="p-2 text-right">{new Date(cust.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!data.allCustomers || data.allCustomers.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSDashboard;

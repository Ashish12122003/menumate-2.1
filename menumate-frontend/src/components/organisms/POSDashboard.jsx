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

const durationOptions = [
  { label: "Today", value: "day" },
  { label: "Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "3 Months", value: "3month" },
  { label: "6 Months", value: "6month" },
  { label: "All Time", value: "all" },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`p-4 rounded-xl shadow-lg ${color} text-white flex flex-col justify-between`}
  >
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

  if (isLoading)
    return <p className="text-center p-8">Loading analytics data...</p>;
  if (analytics.error)
    return (
      <p className="text-center p-8 text-red-500">
        Error: {analytics.error}
      </p>
    );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary">
          POS & Analytics Dashboard
        </h2>

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

      {/* Summary Cards */}
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Performance */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaChartLine />
            <span>Item Performance</span>
          </h3>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-semibold text-gray-700">🏆 Most Popular Item:</p>
              <p className="text-lg font-mono text-green-700">
                {data.mostFavItem?.name || "N/A"}
              </p>
              <span className="text-sm text-gray-500">
                ({data.mostFavItem?.count || 0} orders)
              </span>
            </div>
            <div className="pt-2">
              <p className="font-semibold text-gray-700">📉 Least Popular Item:</p>
              <p className="text-lg font-mono text-red-700">
                {data.leastFavItem?.name || "N/A"}
              </p>
              <span className="text-sm text-gray-500">
                ({data.leastFavItem?.count || 0} orders)
              </span>
            </div>
          </div>
        </div>

        {/* Top Tables */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaTable />
            <span>Top Tables by Order Count</span>
          </h3>
          {data.topTables && data.topTables.length > 0 ? (
            <ul className="space-y-2">
              {data.topTables.map((table, index) => (
                <li key={index} className="flex justify-between text-gray-700">
                  <span className="font-medium">Table {table.tableNumber}</span>
                  <span className="text-primary font-bold">
                    {table.orderCount} orders
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic text-sm">
              No table orders found for this period.
            </p>
          )}
        </div>

        {/* Customer Base */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FaUsers />
            <span>Customer Base</span>
          </h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="font-medium text-gray-700">Total Customers:</span>
              <span className="font-bold text-blue-700">
                {data.totalCustomers || 0}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-700">Repeat Customers:</span>
              <span className="font-bold text-yellow-700">
                {data.repeatCustomersCount || 0}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Repeat Customers */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowRepeat(!showRepeat)}
        >
          <h3 className="text-xl font-bold text-gray-800">
            🔁 Repeat Customers List
          </h3>
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
                {(data.repeatCustomers || []).map((cust, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{cust.name}</td>
                    <td className="p-2">{cust.email}</td>
                    <td className="p-2">{cust.phone}</td>
                    <td className="p-2 text-right font-semibold">
                      {cust.orderCount}
                    </td>
                  </tr>
                ))}
                {(!data.repeatCustomers || data.repeatCustomers.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No repeat customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Customers */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAllCustomers(!showAllCustomers)}
        >
          <h3 className="text-xl font-bold text-gray-800">
            👥 All Customers List
          </h3>
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
                {(data.allCustomers || []).map((cust, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{cust.name}</td>
                    <td className="p-2">{cust.email}</td>
                    <td className="p-2">{cust.phone}</td>
                    <td className="p-2 text-right">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!data.allCustomers || data.allCustomers.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No customers found.
                    </td>
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

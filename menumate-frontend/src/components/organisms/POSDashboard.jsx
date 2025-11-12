import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopAnalytics } from "../../features/vendor/shopSlice";
import {
  FaChartPie,
  FaUsers,
  FaTable,
  FaStar,
  FaRupeeSign,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaSyncAlt,
  FaUser,
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

const POSDashboard = ({ shopId }) => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.shops);
  const [duration, setDuration] = useState("day");
  const [showRepeat, setShowRepeat] = useState(true);
  const [showAllCustomers, setShowAllCustomers] = useState(true);

  const data = analytics.data || {};
  const isLoading = analytics.loading;

  useEffect(() => {
    if (shopId) dispatch(fetchShopAnalytics({ shopId, duration }));
  }, [dispatch, shopId, duration]);

  if (isLoading)
    return (
      <div className="text-center py-16 text-gray-500 text-lg font-medium">
        Loading analytics data...
      </div>
    );

  if (analytics.error)
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        Error: {analytics.error}
      </div>
    );

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
    <div className="space-y-8 bg-[#F8F6F6] p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-[#2F4F4F]">
          POS & Analytics Dashboard
        </h2>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3 text-sm text-[#2F4F4F] focus:ring-1 focus:ring-[#FFA500] focus:outline-none bg-white"
        >
          {durationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-[#E6F9F0] rounded-lg border border-transparent">
          <p className="text-sm font-medium text-green-800">Total Revenue</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            ₹{(data.totalRevenue || 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-[#E6F0FF] rounded-lg border border-transparent">
          <p className="text-sm font-medium text-blue-800">Total Orders</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {data.totalOrders || 0}
          </p>
        </div>
        <div className="p-4 bg-[#FFF4E6] rounded-lg border border-transparent">
          <p className="text-sm font-medium text-orange-800">
            Repeat Customers
          </p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {data.repeatCustomersCount || 0}
          </p>
        </div>
        <div className="p-4 bg-[#F2E6FF] rounded-lg border border-transparent">
          <p className="text-sm font-medium text-purple-800">Avg. Rating</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {(data.averageRating || 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Performance */}
        <div className="border border-gray-200 rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <FaChartPie className="text-[#6F4E37]" />
            <p className="font-semibold text-[#2F4F4F]">Item Performance</p>
          </div>
          <div className="flex justify-center my-6">
            {itemsPie.length ? (
              <CustomChart
                type="pie"
                data={itemsPie}
                dataKey="value"
                nameKey="name"
                colors={["#6F4E37", "#98FF98", "#FFA500"]}
                height={200}
              />
            ) : (
              <p className="text-sm text-gray-500">
                No item performance data available
              </p>
            )}
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-green-500"></span>
              Top Seller
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-blue-200"></span>
              Least Seller
            </div>
          </div>
        </div>

        {/* Top Tables */}
        <div className="border border-gray-200 rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <FaTable className="text-[#6F4E37]" />
            <p className="font-semibold text-[#2F4F4F]">Top Tables</p>
          </div>
          {tablesPie.length ? (
            <CustomChart
              type="pie"
              data={tablesPie}
              dataKey="value"
              nameKey="name"
              colors={["#FFA500", "#6F4E37", "#98FF98"]}
              height={200}
            />
          ) : (
            <p className="text-sm text-gray-500 text-center py-10">
              No table data available
            </p>
          )}
        </div>

        {/* Customer Base */}
        <div className="border border-gray-200 rounded-lg bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="text-[#6F4E37]" />
            <p className="font-semibold text-[#2F4F4F]">Customer Base</p>
          </div>
          <div className="space-y-2 text-sm text-[#2F4F4F]">
            <p>
              Total Customers:{" "}
              <span className="font-semibold">
                {data.totalCustomers || 0}
              </span>
            </p>
            <p>
              Repeat Customers:{" "}
              <span className="font-semibold">
                {data.repeatCustomersCount || 0}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Repeat Customers */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div
          className="flex justify-between items-center p-4 cursor-pointer border-b border-gray-200"
          onClick={() => setShowRepeat(!showRepeat)}
        >
          <div className="flex items-center gap-2">
            <FaSyncAlt className="text-[#6F4E37]" />
            <h3 className="font-semibold text-[#2F4F4F]">
              Repeat Customers List
            </h3>
          </div>
          {showRepeat ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {showRepeat && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9F9F9] text-[#6F4E37] uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Phone</th>
                  <th className="px-6 py-3 font-semibold text-right">Orders</th>
                </tr>
              </thead>
              <tbody>
                {(data.repeatCustomers || []).length > 0 ? (
                  data.repeatCustomers.map((c, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 hover:bg-[#FFF9F3]"
                    >
                      <td className="px-6 py-3">{c.name}</td>
                      <td className="px-6 py-3">{c.phone}</td>
                      <td className="px-6 py-3 text-right font-medium">
                        {c.orderCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-400 italic"
                    >
                      No repeat customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Customers */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div
          className="flex justify-between items-center p-4 cursor-pointer border-b border-gray-200"
          onClick={() => setShowAllCustomers(!showAllCustomers)}
        >
          <div className="flex items-center gap-2">
            <FaUser className="text-[#6F4E37]" />
            <h3 className="font-semibold text-[#2F4F4F]">
              All Customers List
            </h3>
          </div>
          {showAllCustomers ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {showAllCustomers && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F9F9F9] text-[#6F4E37] uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Phone</th>
                  <th className="px-6 py-3 font-semibold text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(data.allCustomers || []).length > 0 ? (
                  data.allCustomers.map((c, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 hover:bg-[#FFF9F3]"
                    >
                      <td className="px-6 py-3">{c.name}</td>
                      <td className="px-6 py-3">{c.phone}</td>
                      <td className="px-6 py-3 text-right">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-400 italic"
                    >
                      No customers found
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

// src/components/molecules/OrderCard.jsx
import React from "react";
import { FaClock, FaChair, FaRupeeSign } from "react-icons/fa";

const OrderCard = ({ order, isSelected, onClick }) => {
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Accepted":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Preparing":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Ready":
        return "bg-green-100 text-green-700 border-green-300";
      case "Completed":
        return "bg-[#B4161B]/10 text-[#B4161B] border-[#B4161B]";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const statusStyle = getStatusColor(order.orderStatus);
  const selectedStyle = isSelected
    ? "ring-2 ring-[#B4161B]/40 border-[#B4161B] scale-[1.01] shadow-md"
    : "border-gray-200 hover:border-[#B4161B]/40 hover:shadow-sm";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white border rounded-xl p-4 mb-3 transition-all duration-200 ease-in-out shadow-sm ${selectedStyle}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        {/* Left: Order ID + Table */}
        <div>
          <h3 className="text-lg font-bold text-[#B4161B] leading-none">
            {order.shortOrderId || "MM-XXXX"}
          </h3>
          <div className="flex items-center text-xs font-medium mt-1 text-gray-600">
            <FaChair className="mr-1 text-[#B4161B]/70" size={12} />
            <span className="truncate">{order.table || "No Table"}</span>
          </div>
        </div>

        {/* Right: Total Amount */}
        <div className="text-right">
          <p className="text-lg font-bold text-[#B4161B] flex items-center">
            <FaRupeeSign size={13} className="mt-[-2px] mr-0.5" />
            {order.totalAmount?.toFixed(0) || 0}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end mt-3 border-t border-dashed border-gray-200 pt-2">
        {/* Time */}
        <div className="flex items-center text-gray-500 text-xs">
          <FaClock className="mr-1 text-[#B4161B]/70" size={12} />
          <span className="font-medium">{formatTime(order.createdAt)}</span>
        </div>

        {/* Status */}
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusStyle}`}
        >
          {order.orderStatus}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;

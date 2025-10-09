// src/components/molecules/OrderCard.jsx
import React from 'react';
import { FaClock, FaChair, FaRupeeSign } from 'react-icons/fa';

const OrderCard = ({ order, isSelected, onClick }) => {
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      case 'Accepted':
        return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'Preparing':
        return 'bg-purple-500/20 text-purple-400 border-purple-400';
      case 'Ready':
        return 'bg-green-500/20  text-green-400 border-green-400';
      default:
        return 'bg-gray-700/20 text-gray-400 border-gray-400';
    }
  };

  const statusStyle = getStatusColor(order.orderStatus);
  const selectedStyle = isSelected
    ? 'ring-2 ring-amber-400 ring-opacity-30 border-amber-400 shadow-md scale-[1.005]'
    : 'border-gray-700 hover:shadow-sm hover:border-gray-500';

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 rounded-lg border-l-4 bg-black/20 transition-all duration-150 ease-in-out ${selectedStyle}`}
    >
      <div className="flex justify-between items-start mb-1">
        {/* Short Order ID & Table */}
        <div>
          <h3 className="text-lg font-bold text-amber-400 leading-none">
            {order.shortOrderId || 'MM-XXXX'}
          </h3>
          <div className="flex items-center text-xs font-medium mt-1 text-gray-400">
            <FaChair className="mr-1" size={12} />
            <span className="truncate">{order.table || 'No Table'}</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <p className="text-xl font-bold text-amber-400 flex items-center">
            <FaRupeeSign size={14} className="mt-[-1px] mr-0.5" />
            {order.totalAmount?.toFixed(0) || 0}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end mt-2 border-t border-dashed border-gray-600 pt-2">
        {/* Time */}
        <div className="flex items-center text-gray-400 text-xs">
          <FaClock className="mr-1" size={12} />
          <span className="font-medium">{formatTime(order.createdAt)}</span>
        </div>

        {/* Status */}
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusStyle}`}>
          {order.orderStatus}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;

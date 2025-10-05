// src/components/molecules/OrderCard.jsx

import React from 'react';
import { FaClock, FaChair, FaRupeeSign } from 'react-icons/fa';

/**
 * A reusable card component for displaying an order summary in the POS queue list.
 * @param {object} order - The order object.
 * @param {boolean} isSelected - Indicates if this card is currently selected.
 * @param {function} onClick - Handler function for clicking the card.
 */
const OrderCard = ({ order, isSelected, onClick }) => {

    // Helper to format the creation time
    const formatTime = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to determine status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-500';
            case 'Accepted':
                return 'bg-blue-100 text-blue-800 border-blue-500';
            case 'Preparing':
                return 'bg-purple-100 text-purple-800 border-purple-500';
            case 'Ready':
                return 'bg-green-100 text-green-800 border-green-500';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-300';
        }
    };

    const statusStyle = getStatusColor(order.orderStatus);
    const selectedStyle = isSelected 
        ? 'ring-4 ring-primary ring-opacity-50 border-primary shadow-lg scale-[1.01]' 
        : 'border-gray-200 hover:shadow-md hover:border-gray-300';

    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border-l-8 bg-white transition-all duration-150 ease-in-out ${selectedStyle}`}
        >
            <div className="flex justify-between items-start mb-2">
                {/* Short Order ID & Table Number */}
                <div>
                    <h3 className="text-xl font-extrabold text-secondary leading-none">
                        {order.shortOrderId || 'MM-XXXX'}
                    </h3>
                    <div className="flex items-center text-sm font-semibold mt-1 text-accent">
                        <FaChair className="mr-1" size={14} />
                        {/* Assuming 'table' field holds the descriptive table name (e.g., "Table 5") */}
                        <span className="truncate">{order.table || 'No Table'}</span> 
                    </div>
                </div>
                
                {/* Total Amount */}
                <div className="text-right">
                    <p className="text-2xl font-black text-primary flex items-center">
                        <FaRupeeSign size={16} className="mt-[-2px] mr-0.5" />
                        {order.totalAmount?.toFixed(0) || 0}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-end mt-3 border-t border-dashed pt-3">
                
                {/* Time Created */}
                <div className="flex items-center text-gray-500 text-sm">
                    <FaClock className="mr-1" />
                    <span className="font-medium">
                        {formatTime(order.createdAt)}
                    </span>
                </div>

                {/* Status Tag */}
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${statusStyle}`}>
                    {order.orderStatus}
                </span>
            </div>
        </div>
    );
};

export default OrderCard;
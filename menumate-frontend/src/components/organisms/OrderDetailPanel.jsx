// src/components/organisms/OrderDetailPanel.jsx

import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FaTable, FaClipboardCheck, FaArrowLeft, FaRupeeSign, FaSpinner } from 'react-icons/fa';
import Button from '../atoms/Button';
import { updateOrderStatus } from '../../features/vendor/vendorOrderSlice'; // Vendor-specific thunk

// Define the Order Status Flow and mapping for button labels
const STATUS_FLOW = {
    Pending: { nextStatus: 'Accepted', label: 'Accept Order', color: 'primary' },
    Accepted: { nextStatus: 'Preparing', label: 'Start Preparing', color: 'secondary' },
    Preparing: { nextStatus: 'Ready', label: 'Order Ready', color: 'accent' },
    Ready: { nextStatus: 'Completed', label: 'Mark Served/Complete', color: 'green' },
    Completed: null, // End of flow
    Cancelled: null, // End of flow
};

const OrderDetailPanel = ({ order, onBack }) => {
    const dispatch = useDispatch();

    if (!order) {
        return (
            <div className="flex flex-col justify-center items-center h-full p-8 text-gray-500">
                <FaClipboardCheck size={60} className="mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Select an order to view details</h2>
                <p className="text-md mt-2 text-center">
                    New orders will appear in the queue on the left.
                </p>
            </div>
        );
    }

    const currentStatus = order.orderStatus;
    const nextAction = STATUS_FLOW[currentStatus];
    
    // Determine button state and handler
    const handleStatusUpdate = (newStatus) => {
        dispatch(updateOrderStatus({ orderId: order._id, status: newStatus }));
    };

    // Placeholder for loading state (if needed, use a separate local state/Redux flag)
    const isUpdating = false; 

    // Calculate total quantity of items
    const totalItems = useMemo(() => {
        return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    }, [order.items]);

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            
            {/* Header and Back Button (Visible on mobile for navigation) */}
            <div className="p-4 bg-white border-b shadow-sm sticky top-0 z-10 flex justify-between items-center">
                <button 
                    onClick={onBack} 
                    className="md:hidden text-secondary flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>
                <h1 className="text-2xl font-bold text-secondary">
                    Order Details - #{order.shortOrderId}
                </h1>
                <div className="hidden md:block w-20"></div> {/* Spacer for alignment */}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 space-y-6">
                
                {/* Order Summary Box */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-xl font-semibold text-secondary">
                            <FaTable className="mr-2 text-accent" />
                            Table: {order.table || 'N/A'}
                        </div>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${order.orderStatus === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-500">Placed at: {new Date(order.createdAt).toLocaleTimeString()}</p>
                        <p className="text-sm text-gray-500">Total Items: {totalItems}</p>
                        <p className="text-sm text-gray-500">Payment: {order.paymentMethod}</p>
                    </div>
                </div>
                
                {/* Item List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-secondary">Items ({order.items?.length || 0})</h2>
                    <div className="space-y-3">
                        {order.items?.map((item, index) => (
                            <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {item.name} 
                                        <span className="text-gray-500 font-medium ml-2">x {item.quantity}</span>
                                    </p>
                                    <p className="text-lg font-bold text-gray-700 flex items-center">
                                        <FaRupeeSign size={12} className="mt-[-1px] mr-0.5" />
                                        {item.price * item.quantity}
                                    </p>
                                </div>
                                {/* Display customizations/modifiers if available */}
                                {item.modifiers && item.modifiers.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-1 pl-4 italic">
                                        {item.modifiers.join(', ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="bg-primary/5 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-secondary">Grand Total:</h3>
                        <p className="text-3xl font-extrabold text-primary flex items-center">
                            <FaRupeeSign size={18} className="mr-1" />
                            {order.totalAmount?.toFixed(2) || 0.00}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Footer (Sticky at bottom for immediate access) */}
            <div className="p-4 bg-white border-t shadow-2xl sticky bottom-0 z-10">
                {nextAction ? (
                    <Button 
                        variant={nextAction.color} 
                        size="lg" 
                        className="w-full"
                        onClick={() => handleStatusUpdate(nextAction.nextStatus)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <FaSpinner className="animate-spin mr-2" /> : <FaClipboardCheck className="mr-2" />}
                        {isUpdating ? 'Updating...' : nextAction.label}
                    </Button>
                ) : (
                    <p className="text-center text-lg font-semibold text-gray-500">
                        Order status is finalized ({currentStatus}).
                    </p>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPanel;
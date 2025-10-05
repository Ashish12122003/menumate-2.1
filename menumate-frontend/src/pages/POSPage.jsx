// src/pages/POSPage.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShopOrders } from '../features/order/orderSlice';
import OrderCard from '../components/molecules/OrderCard'; 
import OrderDetailPanel from '../components/organisms/OrderDetailPanel'; 
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { FaSearch, FaFilter } from 'react-icons/fa';

// Placeholder Statuses for filtering
const ORDER_STATUSES = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

const POSPage = () => {
    const dispatch = useDispatch();
    
    // ⚠️ Placeholder: In a real app, this should come from vendor authentication state
    const currentShopId = '68cdcf01b4bdeac83a5c624a'; // Example ID from backend docs 
    
    const { vendorOrders: orders, loading, error, selectedVendorOrder } = useSelector((state) => state.order);
    
    // Local State for Filters and Search
    const [activeStatus, setActiveStatus] = useState('Pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // 1. Fetch orders whenever the active status changes
    useEffect(() => {
        if (currentShopId) {
            dispatch(fetchShopOrders({ shopId: currentShopId, status: activeStatus }));
        }
    }, [dispatch, currentShopId, activeStatus]);

    // 2. Client-side Search Filter
    const filteredOrders = useMemo(() => {
        if (!searchTerm) return orders;
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return orders.filter(order => 
            order.shortOrderId?.toLowerCase().includes(lowerSearchTerm) || 
            order.table?.toLowerCase().includes(lowerSearchTerm)
        );
    }, [orders, searchTerm]);

    // Set the first order as selected when the list loads/changes
    useEffect(() => {
        if (filteredOrders.length > 0 && !selectedOrder) {
            setSelectedOrder(filteredOrders[0]);
        }
        if (filteredOrders.length === 0) {
             setSelectedOrder(null);
        }
    }, [filteredOrders, selectedOrder]);
    
    
    if (!currentShopId) {
        return <div className="p-8 text-center text-red-500">Please log in as a vendor and select a shop to manage.</div>;
    }

    // --- RENDER START ---
    return (
        <div className="flex h-screen bg-gray-100">
            
            {/* Left Panel: Order Queue (Responsive scrollable list) */}
            <div className={`w-full md:w-5/12 lg:w-4/12 xl:w-3/12 border-r border-gray-200 bg-white flex flex-col ${selectedOrder ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Status Filter Tabs */}
                <div className="p-4 flex flex-wrap gap-2 border-b">
                    {ORDER_STATUSES.map(status => (
                        <Button
                            key={status}
                            variant={activeStatus === status ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setActiveStatus(status)}
                        >
                            {status} ({orders.filter(o => o.orderStatus === status).length})
                        </Button>
                    ))}
                </div>
                
                {/* Search Bar */}
                <div className="p-4 border-b flex items-center space-x-2">
                    <FaSearch className="text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search Order ID or Table..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-none focus:ring-0"
                    />
                </div>

                {/* Order List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <p className="text-center text-primary mt-10">Fetching orders...</p>
                    ) : filteredOrders.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">No orders found in "{activeStatus}".</p>
                    ) : (
                        filteredOrders.map(order => (
                            <OrderCard 
                                key={order._id}
                                order={order}
                                isSelected={selectedOrder?._id === order._id}
                                onClick={() => setSelectedOrder(order)}
                            />
                        ))
                    )}
                </div>
            </div>
            
            {/* Right Panel: Order Details (Responsive) */}
            <div className={`w-full md:w-7/12 lg:w-8/12 xl:w-9/12 bg-gray-50 ${selectedOrder ? 'block' : 'hidden md:block'}`}>
                 <OrderDetailPanel 
                    order={selectedOrder} 
                    onBack={() => setSelectedOrder(null)} // Mobile back button handler
                />
            </div>
        </div>
    );
};

export default POSPage;
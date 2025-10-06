// src/pages/vendor/KOTDisplayPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KOTTicket from '../../components/organisms/KOTTicket';
import useVendorWebSocket from '../../hooks/useVendorWebSocket';
import { fetchOrdersForShop, updateOrderStatus } from '../../features/vendor/orderSlice';

const KOTDisplayPage = () => {
    const dispatch = useDispatch();
    const { vendor } = useSelector(state => state.vendorAuth);
    const { orders } = useSelector(state => state.vendorOrder);
    const [activeTickets, setActiveTickets] = useState([]);

    const shopId = vendor?.shopId;
    
    // Listen for WebSocket events
    useVendorWebSocket(shopId);

    // Fetch initial orders
    useEffect(() => {
        if (shopId) dispatch(fetchOrdersForShop(shopId));
    }, [dispatch, shopId]);

    // Update active tickets when orders change
    useEffect(() => {
        const filtered = orders.filter(order =>
            ['Accepted', 'Preparing', 'Ready'].includes(order.orderStatus)
        );
        setActiveTickets(filtered);
    }, [orders]);

    // Mark ticket as ready (KOT staff action)
    const markAsReady = async (orderId) => {
        try {
            await dispatch(updateOrderStatus({ orderId, status: 'Ready' })).unwrap();
        } catch (err) {
            console.error('Failed to mark order ready:', err);
        }
    };

    if (!vendor) return <div className="p-8 text-center text-gray-600">Please log in to view KOT.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-secondary mb-6">Kitchen Order Display</h1>
            <p className="text-lg text-gray-600 mb-6">Shop: {vendor.name} - Table: {shopId}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeTickets.length === 0 ? (
                    <div className="col-span-full p-10 bg-white rounded-lg text-center text-gray-500">
                        <p className="text-2xl">🟢 No Active Orders! 🟢</p>
                        <p className="mt-2">Waiting for new requests...</p>
                    </div>
                ) : (
                    activeTickets.map(ticket => (
                        <KOTTicket
                            key={ticket._id}
                            order={ticket}
                            onReady={markAsReady}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default KOTDisplayPage;

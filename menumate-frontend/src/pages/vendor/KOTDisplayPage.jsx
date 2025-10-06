// src/pages/vendor/KOTDisplayPage.jsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import KOTTicket from '../../components/organisms/KOTTicket'; // New import
import useVendorWebSocket from '../../hooks/useVendorWebSocket'; // Reused socket hook

const KOTDisplayPage = () => {
    // NOTE: In a real environment, this page would fetch active orders
    // on mount and then use sockets for updates. We use a local state for simplicity.
    const [activeTickets, setActiveTickets] = useState([]);
    const { vendor } = useSelector(state => state.vendorAuth);
    
    // NOTE: This assumes the vendor is logged in and has shop information.
    // For a dedicated KOT screen, the shopId should be passed via URL params.
    const shopId = vendor?.shopId || 'HARDCODED_SHOP_ID'; 

    // Re-use the existing socket hook to listen for new orders
    // We need to modify useVendorWebSocket to also return event data for KOT
    useVendorWebSocket(shopId); 

    // Dummy Socket Logic (Replace with actual socket subscription if needed)
    useEffect(() => {
        // --- Placeholder for fetching initial data ---
        // dispatch(fetchInitialPendingOrders(shopId));

        // Listen for new orders (requires modifying useVendorWebSocket to expose event stream)
        // For now, we will update the state manually for simulation.
        
        // Example: If useVendorWebSocket provides an onNewOrder event:
        /*
        const unsubscribe = useVendorWebSocket.onNewOrder((newOrder) => {
            setActiveTickets(prev => [newOrder, ...prev]);
        });
        return unsubscribe;
        */
       
    }, [shopId]);

    // Function for kitchen staff to mark a ticket as done/ready
    const markAsReady = (orderId) => {
        // Ideally, this calls a PATCH /api/vendor/orders/:orderId/status API endpoint
        // to set status to 'Preparing' or 'Ready'.
        
        setActiveTickets(prev => 
            prev.filter(ticket => ticket._id !== orderId)
        );
        console.log(`Order ${orderId} marked as ready.`);
    };

    if (!vendor) return <div className="p-8 text-center text-gray-600">Please log in to view KOT.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-secondary mb-6">Kitchen Order Display</h1>
            <p className="text-lg text-gray-600 mb-6">Shop: {vendor.name} - Table: {shopId}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeTickets.length === 0 ? (
                    <div className="col-span-full p-10 bg-white rounded-lg text-center text-gray-500">
                        <p className="text-2xl">🟢 No New Orders! 🟢</p>
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
                
                {/* --- SIMULATION BUTTON --- */}
                <button
                    onClick={() => setActiveTickets(prev => [
                        { _id: Date.now(), shortOrderId: `KOT-${Math.floor(Math.random() * 900) + 100}`, table: { tableNumber: `T${Math.floor(Math.random() * 10)}` }, totalAmount: 1500, items: [{name: 'Latte', quantity: 2}, {name: 'Pizza', quantity: 1}]}, 
                        ...prev
                    ])}
                    className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg"
                >
                    + SIMULATE ORDER
                </button>
            </div>
        </div>
    );
};

export default KOTDisplayPage;
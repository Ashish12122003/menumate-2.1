// src/pages/vendor/KOTDisplayPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KOTTicket from '../../components/organisms/KOTTicket';
import useVendorWebSocket from '../../hooks/useVendorWebSocket';
import { fetchOrdersForShop, updateOrderStatus } from '../../features/vendor/orderSlice';
import { setSelectedShop, fetchMyShops } from '../../features/vendor/shopSlice';

// Mapping orderStatus → next button label
const nextActionMap = {
  Accepted: 'Start Preparing',
  Preparing: 'Mark Ready',
  Ready: 'Complete Order',
};

const KOTDisplayPage = () => {
  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorAuth);
  const { orders } = useSelector(state => state.vendorOrder);
  const { shops, selectedShop, loading: shopsLoading } = useSelector(state => state.shops);

  const [activeTickets, setActiveTickets] = useState([]);

  // 1️⃣ Fetch shops on mount
  useEffect(() => {
    dispatch(fetchMyShops());
  }, [dispatch]);

  // 2️⃣ Auto-select the first shop if none selected
  useEffect(() => {
    if (!shopsLoading && shops.length > 0 && !selectedShop) {
      dispatch(setSelectedShop(shops[0]));
    }
  }, [shops, shopsLoading, selectedShop, dispatch]);

  const shopId = selectedShop?._id;

  // 3️⃣ Fetch orders when shopId is available
  useEffect(() => {
    if (shopId) dispatch(fetchOrdersForShop(shopId));
  }, [dispatch, shopId]);

  // 4️⃣ WebSocket for real-time updates
  useVendorWebSocket(shopId);

  // 5️⃣ Update active tickets whenever orders change
  useEffect(() => {
    const filtered = orders.filter(order =>
      ['Accepted', 'Preparing', 'Ready'].includes(order.orderStatus)
    );
    setActiveTickets(filtered);
  }, [orders]);

  // 6️⃣ Progress order to next stage
  const progressOrderStatus = (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'Accepted'
      ? 'Preparing'
      : currentStatus === 'Preparing'
      ? 'Ready'
      : currentStatus === 'Ready'
      ? 'Completed'
      : null;

    if (!nextStatus) return;

    // Optimistic UI update
    setActiveTickets(prev =>
      prev.map(ticket =>
        ticket._id === orderId ? { ...ticket, orderStatus: nextStatus } : ticket
      )
    );

    // Backend update
    dispatch(updateOrderStatus({ orderId, status: nextStatus }))
      .unwrap()
      .catch(err => {
        console.error('Failed to update order status', err);
        // Revert UI if backend fails
        setActiveTickets(prev =>
          prev.map(ticket =>
            ticket._id === orderId ? { ...ticket, orderStatus: currentStatus } : ticket
          )
        );
      });
  };

  if (!vendor) return <div className="p-8 text-center text-gray-600">Please log in to view KOT.</div>;
  if (!shopId) return <div className="p-8 text-center text-gray-600">Loading shop info...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-secondary mb-6">Kitchen Order Display</h1>
      <p className="text-lg text-gray-600 mb-6">Shop: {vendor.name} - ID: {shopId}</p>

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
              // Send label dynamically based on orderStatus
              nextActionLabel={nextActionMap[ticket.orderStatus]}
              onNextStage={() => progressOrderStatus(ticket._id, ticket.orderStatus)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KOTDisplayPage;

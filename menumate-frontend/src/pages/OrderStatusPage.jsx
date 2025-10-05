// src/pages/OrderStatusPage.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from '../hooks/useWebSocket';
import BottomNavBar from '../components/organisms/BottomNavBar';
import { fetchUserOrders } from '../features/order/orderSlice';

// Status mapping for display
const statusMap = {
  Pending: { text: 'Order Received', color: 'text-yellow-500' },
  Accepted: { text: 'Order Accepted', color: 'text-blue-500' },
  Preparing: { text: 'Preparing your food', color: 'text-purple-500' },
  Ready: { text: 'Ready for Serving', color: 'text-green-500' },
  Completed: { text: 'Order Completed', color: 'text-green-700' },
  Cancelled: { text: 'Order Cancelled', color: 'text-red-500' },
};

const OrderStatusPage = () => {
  const dispatch = useDispatch();
  const { userOrders: orders, loading, error } = useSelector((state) => state.order);


  // Initialize WebSocket connection for live updates
  useWebSocket();

  // Fetch all orders for the logged-in user
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => dispatch(fetchUserOrders())}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto p-4 md:px-8 lg:px-12">
        <h1 className="text-4xl font-bold text-secondary text-center mb-8">
          Your Orders
        </h1>

        {orders.map((order) => {
          const statusInfo = statusMap[order.orderStatus] || { text: order.orderStatus, color: 'text-gray-500' };

          return (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Order #{order.shortOrderId}
              </h2>
              <p className="text-gray-500 mb-4">
                from {order.shop?.name || 'Your selected shop'}
              </p>

              <div className="text-center mb-4">
                <p className="text-lg font-semibold text-gray-700">Order Status</p>
                <p className={`text-3xl font-extrabold mt-2 ${statusInfo.color}`}>
                  {statusInfo.text}
                </p>
              </div>

              <div className="border-t border-dashed pt-4">
                <h3 className="text-xl font-bold mb-2">Order Summary</h3>
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.menuItem || index}-${item.name}`}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <span className="text-lg font-medium">{item.name} x {item.quantity}</span>
                    <span className="text-lg font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-dashed">
                  <span className="text-xl font-bold">Total Amount:</span>
                  <span className="text-2xl font-extrabold text-primary">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default OrderStatusPage;

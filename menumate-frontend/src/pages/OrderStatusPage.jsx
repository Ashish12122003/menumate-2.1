// src/pages/OrderStatusPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from '../hooks/useWebSocket';
import BottomNavBar from '../components/organisms/BottomNavBar';
import { fetchUserOrders } from '../features/order/orderSlice';

const statusMap = {
  Pending: { text: 'Order Received', color: 'text-yellow-400' },
  Accepted: { text: 'Order Accepted', color: 'text-blue-400' },
  Preparing: { text: 'Preparing your food', color: 'text-purple-400' },
  Ready: { text: 'Ready for Serving', color: 'text-green-400' },
  Completed: { text: 'Order Completed', color:'text-green-500' },
  Cancelled: { text: 'Order Cancelled', color: 'text-red-500' },
};

const OrderStatusPage = () => {
  const dispatch = useDispatch();
  const { userOrders: orders, loading, error } = useSelector((state) => state.order);

  useWebSocket();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (error) return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#110D09] text-red-400">
      <p>Error: {error}</p>
      <button
        onClick={() => dispatch(fetchUserOrders())}
        className="mt-2 px-3 py-1 bg-amber-500 text-black rounded hover:bg-amber-600 text-sm"
      >
        Retry
      </button>
    </div>
  );
  if (!orders || orders.length === 0) return <div className="flex justify-center items-center h-screen bg-[#110D09] text-gray-400 text-sm">No orders found.</div>;

  return (
    <div className="bg-[#110D09] text-gray-200 min-h-screen pb-20">
      <div className="container mx-auto px-3 pt-4">
        <h1 className="text-2xl font-bold text-amber-400 text-center mb-4">Your Orders</h1>

        {orders.map((order) => {
          const statusInfo = statusMap[order.orderStatus] || { text: order.orderStatus, color: 'text-gray-400' };
          return (
            <div key={order._id} className="bg-black/20 border border-white/10 rounded-lg p-3 mb-3 shadow-sm text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-amber-400">#{order.shortOrderId}</span>
                <span className={`px-1.5 py-0.5 rounded-full border ${statusInfo.color} text-xs font-bold`}>{order.orderStatus}</span>
              </div>
              <p className="text-gray-400 mb-1">{order.shop?.name || 'Your selected shop'}</p>

              <div className="border-t border-dashed border-gray-600 pt-2">
                {order.items?.map((item, idx) => (
                  <div key={`${item.menuItem || idx}-${item.name}`} className="flex justify-between py-0.5 border-b border-gray-700 last:border-b-0">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-1 pt-1 border-t border-dashed border-gray-600 font-bold">
                  <span>Total:</span>
                  <span className="text-amber-400">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNavBar />
    </div>
  );
};

export default OrderStatusPage;

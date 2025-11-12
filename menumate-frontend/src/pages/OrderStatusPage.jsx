// src/pages/OrderStatusPage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWebSocket from "../hooks/useWebSocket";
import BottomNavBar from "../components/organisms/BottomNavBar";
import { fetchUserOrders } from "../features/order/orderSlice";

const statusMap = {
  Pending: {
    text: "Order Received",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  Accepted: {
    text: "Order Accepted",
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  Preparing: {
    text: "Preparing your food",
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
  Ready: {
    text: "Ready for Serving",
    color: "bg-green-100 text-green-700 border-green-300",
  },
  Completed: {
    text: "Order Completed",
    color: "bg-[#B4161B]/10 text-[#B4161B] border-[#B4161B]/30",
  },
  Cancelled: {
    text: "Order Cancelled",
    color: "bg-red-100 text-red-700 border-red-300",
  },
};

const OrderStatusPage = () => {
  const dispatch = useDispatch();
  const { userOrders: orders, loading, error } = useSelector(
    (state) => state.order
  );

  useWebSocket();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white text-red-600">
        <p className="text-sm font-medium mb-2">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchUserOrders())}
          className="px-4 py-2 bg-[#B4161B] text-white rounded-full text-sm font-semibold hover:bg-[#D92A2A] transition"
        >
          Retry
        </button>
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-500 text-sm">
        No orders found.
      </div>
    );

  return (
    <div className="bg-white text-gray-800 min-h-screen pb-20">
      <div className="container mx-auto px-3 pt-6">
        <h1 className="text-3xl font-bold text-center mb-5 text-[#B4161B]">
          Your Orders
        </h1>

        {orders.map((order) => {
          const statusInfo =
            statusMap[order.orderStatus] || {
              text: order.orderStatus,
              color: "bg-gray-100 text-gray-700 border-gray-300",
            };

          return (
            <div
              key={order._id}
              className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Header */}
              <div className="flex justify-between mb-2">
                <span className="font-bold text-[#B4161B]">
                  #{order.shortOrderId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusInfo.color}`}
                >
                  {statusInfo.text}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {order.shop?.name || "Selected Shop"}
              </p>

              {/* Item List */}
              <div className="border-t border-dashed border-gray-300 pt-2">
                {order.items?.map((item, idx) => (
                  <div
                    key={`${item.menuItem || idx}-${item.name}`}
                    className="flex justify-between py-1 border-b border-gray-200 last:border-b-0 text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-gray-300 font-bold">
                  <span>Total:</span>
                  <span className="text-[#B4161B]">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
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

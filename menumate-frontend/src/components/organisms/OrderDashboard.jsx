import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersForShop,
  updateOrderStatus,
} from "../../features/vendor/orderSlice";
import useVendorWebSocket from "../../hooks/useVendorWebSocket";

const OrderDashboard = ({ shopId }) => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector(
    (state) => state.vendorOrder
  );

  useVendorWebSocket(shopId);

  useEffect(() => {
    if (shopId) dispatch(fetchOrdersForShop(shopId));
  }, [dispatch, shopId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      dispatch(fetchOrdersForShop(shopId));
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const sections = [
    { title: "Pending", color: "text-[#B4161B]", bg: "bg-[#FFF5F5]" },
    { title: "Accepted", color: "text-[#B85C38]", bg: "bg-[#FFF8F6]" },
    { title: "Preparing", color: "text-[#D97706]", bg: "bg-[#FFF7E5]" },
    { title: "Ready", color: "text-[#15803D]", bg: "bg-[#F0FFF4]" },
    { title: "Completed", color: "text-[#4B5563]", bg: "bg-[#F9FAFB]" },
  ];

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 font-medium animate-pulse">
        Loading orders...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {sections.map((section) => {
        const filtered = orders.filter(
          (o) => o.orderStatus === section.title
        );

        return (
          <div
            key={section.title}
            className={`${section.bg} rounded-xl p-4 shadow-md border border-gray-200 flex flex-col gap-4`}
          >
            {/* Header */}
            <h3
              className={`text-base font-bold border-b border-gray-300 pb-1 ${section.color}`}
            >
              {section.title} ({filtered.length})
            </h3>

            {filtered.length === 0 ? (
              <p className="text-gray-400 text-center text-sm mt-6">
                No orders
              </p>
            ) : (
              filtered.map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-gray-900">
                      #{order.shortOrderId || order._id?.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString()
                        : ""}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="text-xs text-gray-500 space-y-1 mb-2">
                    <p>
                      {order.table?.tableNumber
                        ? `Table: ${order.table.tableNumber}`
                        : "Takeaway"}
                    </p>
                    <p>Customer: {order.user?.name || "Guest"}</p>
                  </div>

                  {/* Items */}
                  <ul className="text-sm text-gray-800 list-disc pl-5 space-y-1 mb-2">
                    {order.items?.map((item, i) => (
                      <li key={i}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>

                  {/* Total */}
                  <p className="text-sm font-bold text-right text-gray-800">
                    Total: ₹{order.totalAmount}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-3">
                    {section.title === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "Rejected")
                          }
                          className="flex-1 text-xs font-bold py-2 px-3 rounded-md bg-red-100 text-[#B4161B] hover:bg-red-200 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "Accepted")
                          }
                          className="flex-1 text-xs font-bold py-2 px-3 rounded-md bg-[#B4161B] text-white hover:bg-[#D92A2A] transition"
                        >
                          Accept
                        </button>
                      </>
                    )}

                    {section.title === "Accepted" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Preparing")
                        }
                        className="w-full text-xs font-bold py-2 px-3 rounded-md bg-[#B85C38] text-white hover:bg-[#A34925] transition"
                      >
                        Start Preparing
                      </button>
                    )}

                    {section.title === "Preparing" && (
                      <button
                        onClick={() => handleStatusChange(order._id, "Ready")}
                        className="w-full text-xs font-bold py-2 px-3 rounded-md bg-[#D97706] text-white hover:bg-[#B45309] transition"
                      >
                        Mark as Ready
                      </button>
                    )}

                    {section.title === "Ready" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Completed")
                        }
                        className="w-full text-xs font-bold py-2 px-3 rounded-md bg-[#16A34A] text-white hover:bg-[#15803D] transition"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderDashboard;

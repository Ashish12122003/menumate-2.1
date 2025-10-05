// src/components/organisms/OrderDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersForShop, updateOrderStatus } from '../../features/vendor/orderSlice';
import useVendorWebSocket from '../../hooks/useVendorWebSocket';

const OrderDashboard = ({ shopId }) => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.vendorOrder);

  useVendorWebSocket(shopId);

  useEffect(() => {
    if (shopId) dispatch(fetchOrdersForShop(shopId));
  }, [dispatch, shopId]);

  const handleStatusChange = async (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order._id === orderId ? { ...order, orderStatus: newStatus } : order
    );
    dispatch({ type: 'vendorOrder/setOrders', payload: updatedOrders });

    try {
      const updatedOrder = await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      const refreshedOrders = orders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
      dispatch({ type: 'vendorOrder/setOrders', payload: refreshedOrders });
    } catch (err) {
      console.error('Failed to update order status', err);
      dispatch(fetchOrdersForShop(shopId));
    }
  };

  if (loading) return <div className="text-center p-4">Loading orders...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  const statusSections = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4">
      {statusSections.map(status => {
        const filteredOrders = orders.filter(order => order.orderStatus === status);
        return (
          <div key={status} className="bg-gray-50 p-4 rounded-xl shadow-lg flex flex-col max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-700 border-b pb-2">{status} ({filteredOrders.length})</h2>
            {filteredOrders.length === 0 ? (
              <p className="text-gray-400 text-center mt-4">No orders</p>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order._id}
                  className={`bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 hover:scale-105 transition-transform duration-200
                    ${status === 'Completed' ? 'border-gray-400 opacity-70' : 'border-indigo-500'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-gray-800">{order.shortOrderId}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                      ${order.orderStatus === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                        order.orderStatus === 'Accepted' ? 'bg-blue-200 text-blue-800' :
                        order.orderStatus === 'Preparing' ? 'bg-green-200 text-green-800' :
                        order.orderStatus === 'Ready' ? 'bg-purple-200 text-purple-800' :
                        'bg-gray-200 text-gray-800'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Table: <span className="font-medium">{order.table?.tableNumber}</span></p>
                  <p className="text-sm text-gray-600 mb-2">Customer: <span className="font-medium">{order.user?.name || 'Guest'}</span></p>
                  <ul className="list-disc pl-5 mb-2 text-sm text-gray-700 space-y-1">
                    {order.items.map(item => (
                      <li key={item.menuItem}>{item.name} x {item.quantity}</li>
                    ))}
                  </ul>
                  <div className="text-sm font-bold text-gray-800 mb-3">Total: ₹{order.totalAmount}</div>

                  {/* Action Buttons */}
                  {status !== 'Completed' && (
                    <div className="flex flex-wrap gap-2">
                      {status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'Accepted')}
                          className="flex-1 bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition"
                        >Accept</button>
                      )}
                      {status === 'Accepted' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'Preparing')}
                          className="flex-1 bg-green-500 text-white py-1 rounded-md hover:bg-green-600 transition"
                        >Prepare</button>
                      )}
                      {status === 'Preparing' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'Ready')}
                          className="flex-1 bg-purple-500 text-white py-1 rounded-md hover:bg-purple-600 transition"
                        >Ready</button>
                      )}
                      {status === 'Ready' && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'Completed')}
                          className="flex-1 bg-teal-500 text-white py-1 rounded-md hover:bg-teal-600 transition"
                        >Complete</button>
                      )}
                      {['Pending', 'Accepted', 'Preparing'].includes(status) && (
                        <button
                          onClick={() => handleStatusChange(order._id, 'Cancelled')}
                          className="flex-1 bg-gray-300 text-gray-700 py-1 rounded-md hover:bg-gray-400 transition"
                        >Cancel</button>
                      )}
                    </div>
                  )}
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

// src/components/organisms/OrderDetailPanel.jsx
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FaTable, FaClipboardCheck, FaArrowLeft, FaRupeeSign } from 'react-icons/fa';
import Button from '../atoms/Button';
import { updateOrderStatus } from '../../features/vendor/vendorOrderSlice';

const STATUS_FLOW = {
  Pending: { nextStatus: 'Accepted', label: 'Accept', color: 'primary' },
  Accepted: { nextStatus: 'Preparing', label: 'Prepare', color: 'secondary' },
  Preparing: { nextStatus: 'Ready', label: 'Ready', color: 'accent' },
  Ready: { nextStatus: 'Completed', label: 'Serve', color: 'green' },
  Completed: null,
  Cancelled: null,
};

const OrderDetailPanel = ({ order, onBack }) => {
  const dispatch = useDispatch();
  if (!order)
    return (
      <div className="flex flex-col justify-center items-center h-full p-4 text-gray-500">
        <FaClipboardCheck size={50} className="mb-3 text-gray-400" />
        <h2 className="text-lg font-semibold">Select an order</h2>
      </div>
    );

  const currentStatus = order.orderStatus;
  const nextAction = STATUS_FLOW[currentStatus];
  const totalItems = useMemo(() => order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0, [order.items]);

  const handleStatusUpdate = (status) => dispatch(updateOrderStatus({ orderId: order._id, status }));

  return (
    <div className="flex flex-col h-full overflow-y-auto text-sm">
      {/* Header */}
      <div className="p-3 bg-white border-b flex justify-between items-center sticky top-0 z-10">
        <button onClick={onBack} className="md:hidden text-secondary p-1 rounded hover:bg-gray-100 flex items-center">
          <FaArrowLeft className="mr-1" /> Back
        </button>
        <h1 className="text-lg font-bold text-secondary">Order #{order.shortOrderId}</h1>
        <div className="hidden md:block w-16"></div>
      </div>

      <div className="flex-1 p-3 space-y-3">
        {/* Summary */}
        <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center font-semibold text-secondary">
              <FaTable className="mr-1 text-accent" /> {order.table || 'N/A'}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentStatus === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {order.orderStatus}
            </span>
          </div>
          <p className="text-gray-500">Placed: {new Date(order.createdAt).toLocaleTimeString()}</p>
          <p className="text-gray-500">Items: {totalItems}</p>
          <p className="text-gray-500">Payment: {order.paymentMethod}</p>
        </div>

        {/* Items */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between border-b border-gray-300 last:border-b-0 py-1">
              <div>
                {item.name} x {item.quantity}
                {item.modifiers && item.modifiers.length > 0 && <p className="text-gray-400 text-xs italic">{item.modifiers.join(', ')}</p>}
              </div>
              <div className="flex items-center">
                <FaRupeeSign size={12} className="mr-0.5" />
                {item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-primary/10 p-3 rounded-lg flex justify-between font-bold">
          <span>Total:</span>
          <span className="text-primary flex items-center">
            <FaRupeeSign size={14} className="mr-0.5" /> {order.totalAmount?.toFixed(2) || 0.0}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-white border-t sticky bottom-0 z-10">
        {nextAction ? (
          <Button variant={nextAction.color} size="md" className="w-full" onClick={() => handleStatusUpdate(nextAction.nextStatus)}>
            <FaClipboardCheck className="mr-1" /> {nextAction.label}
          </Button>
        ) : (
          <p className="text-center text-gray-500 text-sm">Order finalized ({currentStatus})</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPanel;

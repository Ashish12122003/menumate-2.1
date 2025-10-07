import React from 'react';

const KOTTicket = ({ order, nextActionLabel, onNextStage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-lg mb-2">{order.shortOrderId}</h2>
        <p className="text-gray-500 mb-1">Table: {order.table?.tableNumber}</p>
        <p className="text-gray-700 mb-2">Status: {order.orderStatus}</p>

        <div className="border-t border-dashed pt-2">
          <h3 className="font-semibold mb-2">Items:</h3>
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between py-1">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {nextActionLabel && (
        <button
          onClick={onNextStage}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {nextActionLabel}
        </button>
      )}
    </div>
  );
};

export default KOTTicket;

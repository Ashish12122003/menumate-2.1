// src/pages/CartPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";

import { placeOrder } from "../features/order/orderSlice";
import { clearCart, incrementItemQuantity, decrementItemQuantity } from "../features/cart/cartSlice";
import { syncCart } from "../api/cartService";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { table, shop, qrIdentifier } = useSelector((state) => state.menu);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!shop || !table || items.length === 0) return alert("Cart is empty or shop/table missing");
    setIsProcessing(true);
    try {
      await syncCart({ shop: shop?._id || shop, table: table?._id || table, items });
      const orderData = {
        paymentMethod: "COD",
        tableId: table._id || table,
        shopId: shop._id || shop,
        items: items.map((i) => ({ menuItem: i._id || i.menuItem, quantity: i.quantity, price: i.price })),
      };
      const result = await dispatch(placeOrder(orderData));
      if (placeOrder.fulfilled.match(result)) {
        const newOrderId = result.payload?.order?._id || result.payload?.data?.order?._id;
        dispatch(clearCart());
        if (newOrderId) navigate(`/order/${newOrderId}`);
        else alert("Order placed but no ID found!");
      } else alert("Order placement failed.");
    } catch (err) {
      console.error(err);
      alert("Order failed. Try again.");
    } finally { setIsProcessing(false); }
  };

  const handleIncrement = (id) => dispatch(incrementItemQuantity(id));
  const handleDecrement = (id) => dispatch(decrementItemQuantity(id));
  const handleDelete = (id) => {
    const item = items.find((i) => i._id === id);
    if (item) for (let i = 0; i < item.quantity; i++) dispatch(decrementItemQuantity(id));
  };

  const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : "/";

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-[#110D09] text-gray-300 p-4">
        <h1 className="text-2xl font-bold mb-2">
          <Link to={menuUrl} className="text-amber-400 hover:underline">Your Cart is Empty</Link>
        </h1>
        <p className="text-gray-400 mb-4">Add some delicious items from the menu.</p>
        <Link to={menuUrl} className="bg-amber-500 text-black font-bold py-2 px-6 rounded-full shadow hover:bg-amber-600 transition">
          Go to Menu
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-[#211B14] to-[#110D09] text-gray-200 pb-20">
      <div className="max-w-3xl mx-auto bg-black/20 border border-white/10 rounded-lg p-4 shadow">
        <h1 className="text-2xl font-bold text-center mb-4 text-amber-400">Your Order</h1>

        <div className="flex flex-col space-y-2">
          {items.map((item) => (
            <div key={item._id || item.menuItem} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
              <div className="flex-1 pr-2">
                <h2 className="text-lg font-semibold text-amber-400">{item.name}</h2>
                <p className="text-sm text-gray-400">₹{item.price.toFixed(2)} x {item.quantity}</p>
                <p className="text-sm text-amber-500 font-bold">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-1 border border-amber-500 rounded-full text-amber-400">
                  <button
                    onClick={() => handleDecrement(item._id || item.menuItem)}
                    className="w-6 h-6 flex items-center justify-center text-sm rounded-full hover:bg-amber-600/20 transition"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item._id || item.menuItem)}
                    className="w-6 h-6 flex items-center justify-center text-sm rounded-full hover:bg-amber-600/20 transition"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Delete Button matching FloatingCartButton theme */}
                <button
                  onClick={() => handleDelete(item._id || item.menuItem)}
                  className="w-6 h-6 flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-[#1a1a1a] shadow-lg shadow-amber-800/40 hover:scale-110 transition-all duration-200"
                  title="Remove Item"
                >
                  <MdDelete size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/20 text-sm font-bold text-amber-400">
          <span>Total:</span>
          <span className="text-lg text-amber-500">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-center space-x-3 mt-4 max-w-3xl mx-auto">
        <Link
          to={menuUrl}
          className="bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded-full shadow hover:bg-gray-700 transition"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handlePlaceOrder}
          className="bg-amber-500 text-black font-bold py-2 px-3 rounded-full shadow hover:bg-amber-600 transition"
          disabled={items.length === 0 || !shop || !table || isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;

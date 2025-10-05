// src/pages/CartPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";

import { placeOrder } from "../features/order/orderSlice";
import {
  clearCart,
  incrementItemQuantity,
  decrementItemQuantity,
} from "../features/cart/cartSlice";
import { syncCart } from "../api/cartService"; // ✅ import syncCart

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { table, shop, qrIdentifier } = useSelector((state) => state.menu);

  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Place Order Function
  const handlePlaceOrder = async () => {
    if (!shop || !table || items.length === 0) {
      alert("Cart is empty or shop/table missing");
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ Sync the cart with backend
      await syncCart({
        shop: shop?._id || shop,
        table: table?._id || table,
        items: items,
      });

      // ✅ Prepare order payload
      const orderData = {
      paymentMethod: "COD",
      tableId: table._id || table,
      shopId: shop._id || shop,
      items: items.map(item => ({
        menuItem: item._id || item.menuItem, // make sure this is correct ID
        quantity: item.quantity,
        price: item.price,
      })),
    };

      // ✅ Dispatch order creation
      const resultAction = await dispatch(placeOrder(orderData));

      if (placeOrder.fulfilled.match(resultAction)) {
        const newOrderId =
          resultAction.payload?.order?._id ||
          resultAction.payload?.data?.order?._id;

        dispatch(clearCart());
        if (newOrderId) {
          navigate(`/order/${newOrderId}`);
        } else {
          alert("Order placed but could not find order ID!");
        }
      } else {
        alert("Order placement failed.");
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Quantity handlers
  const handleIncrement = (id) => dispatch(incrementItemQuantity(id));
  const handleDecrement = (id) => dispatch(decrementItemQuantity(id));

  const handleDelete = (id) => {
    const item = items.find((i) => i._id === id);
    if (item) {
      for (let i = 0; i < item.quantity; i++) dispatch(decrementItemQuantity(id));
    }
  };

  const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : "/";

  // ✅ Empty Cart View
  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 text-secondary p-6">
        <h1 className="text-3xl font-bold mb-3"><Link to={menuUrl}>Your Cart is Empty</Link></h1>
        <p className="text-gray-500 mb-6">
          Start by adding some delicious items from the menu.
        </p>
        <Link
          to={menuUrl}
          className="bg-primary text-black font-bold py-3 px-7 rounded-full shadow-lg hover:bg-orange-700 transition-all"
        >
          Go to Menu
        </Link>
      </div>
    );

  // ✅ Main Cart Page
  return (
    <div className="min-h-screen p-6 bg-gray-50 text-secondary">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-secondary">
          Your Order
        </h1>

        {/* Item List */}
        <div className="flex flex-col space-y-4">
          {items.map((item) => (
            <div
              key={item._id || item.menuItem}
              className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1 pr-4">
                <h2 className="text-lg font-semibold text-secondary">{item.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{item.price.toFixed(2)} x {item.quantity}
                </p>
                <p className="text-sm text-primary font-bold">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-2 border border-orange-500 rounded-full text-orange-500">
                  <button
                    onClick={() => handleDecrement(item._id || item.menuItem)}
                    className="w-8 h-8 flex items-center justify-center text-lg rounded-full transition hover:bg-orange-50"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="font-bold text-sm text-secondary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrement(item._id || item.menuItem)}
                    className="w-8 h-8 flex items-center justify-center text-lg rounded-full transition hover:bg-orange-50"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item._id || item.menuItem)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove Item"
                >
                  <MdDelete size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t-2 border-dashed border-gray-300">
          <span className="text-xl font-bold text-secondary">Total:</span>
          <span className="text-2xl font-extrabold text-primary">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-8 max-w-4xl mx-auto">
        <Link
          to={menuUrl}
          className="bg-gray-300 text-secondary font-bold py-3 px-8 rounded-full shadow-md hover:bg-gray-400 transition-all"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handlePlaceOrder}
          className="bg-accent text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-all"
          disabled={items.length === 0 || !shop || !table || isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;

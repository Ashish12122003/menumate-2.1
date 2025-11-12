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
import { syncCart } from "../api/cartService";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { table, shop, qrIdentifier } = useSelector((state) => state.menu);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!shop || !table || items.length === 0)
      return alert("Cart is empty or shop/table missing");
    setIsProcessing(true);
    try {
      await syncCart({
        shop: shop?._id || shop,
        table: table?._id || table,
        items,
      });
      const orderData = {
        paymentMethod: "COD",
        tableId: table._id || table,
        shopId: shop._id || shop,
        items: items.map((i) => ({
          menuItem: i._id || i.menuItem,
          quantity: i.quantity,
          price: i.price,
        })),
      };
      const result = await dispatch(placeOrder(orderData));
      if (placeOrder.fulfilled.match(result)) {
        const newOrderId =
          result.payload?.order?._id || result.payload?.data?.order?._id;
        dispatch(clearCart());
        if (newOrderId) navigate(`/order/${newOrderId}`);
        else alert("Order placed but no ID found!");
      } else alert("Order placement failed.");
    } catch (err) {
      console.error(err);
      alert("Order failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncrement = (id) => dispatch(incrementItemQuantity(id));
  const handleDecrement = (id) => dispatch(decrementItemQuantity(id));
  const handleDelete = (id) => {
    const item = items.find((i) => i._id === id);
    if (item)
      for (let i = 0; i < item.quantity; i++) dispatch(decrementItemQuantity(id));
  };

  const menuUrl = qrIdentifier ? `/menu/${qrIdentifier}` : "/";

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-white text-gray-600 p-4">
        <h1 className="text-2xl font-bold mb-2">
          <Link to={menuUrl} className="text-[#B4161B] hover:underline">
            Your Cart is Empty
          </Link>
        </h1>
        <p className="text-gray-500 mb-4">
          Add some delicious items from the menu.
        </p>
        <Link
          to={menuUrl}
          className="bg-[#B4161B] text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-[#D92A2A] transition"
        >
          Go to Menu
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 pb-24">
      <div className="max-w-3xl mx-auto bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#B4161B]">
          Your Order
        </h1>

        <div className="flex flex-col space-y-3">
          {items.map((item) => (
            <div
              key={item._id || item.menuItem}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
            >
              {/* Item Details */}
              <div className="flex-1 pr-2">
                <h2 className="text-lg font-semibold text-[#B4161B]">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-600">
                  ₹{item.price.toFixed(2)} x {item.quantity}
                </p>
                <p className="text-sm text-[#B4161B] font-bold mt-1">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Quantity & Delete */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 border border-[#B4161B] rounded-full text-[#B4161B]">
                  <button
                    onClick={() =>
                      handleDecrement(item._id || item.menuItem)
                    }
                    className="w-6 h-6 flex items-center justify-center text-sm rounded-full hover:bg-[#B4161B] hover:text-white transition"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleIncrement(item._id || item.menuItem)
                    }
                    className="w-6 h-6 flex items-center justify-center text-sm rounded-full hover:bg-[#B4161B] hover:text-white transition"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(item._id || item.menuItem)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[#B4161B] text-white hover:bg-[#D92A2A] transition shadow-md"
                  title="Remove Item"
                >
                  <MdDelete size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-300 text-sm font-bold">
          <span>Total:</span>
          <span className="text-lg text-[#B4161B]">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-3 mt-6 max-w-3xl mx-auto">
        <Link
          to={menuUrl}
          className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-full shadow hover:bg-gray-300 transition"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handlePlaceOrder}
          className="bg-[#B4161B] text-white font-bold py-2 px-5 rounded-full shadow-md hover:bg-[#D92A2A] transition"
          disabled={items.length === 0 || !shop || !table || isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;

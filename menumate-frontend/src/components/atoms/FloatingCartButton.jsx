// src/components/atoms/FloatingCartButton.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const FloatingCartButton = () => {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);

  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => navigate("/cart")}
      aria-label="View Cart"
      className="fixed bottom-20 right-5 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-full bg-[#B4161B] text-white font-semibold shadow-lg shadow-red-300 hover:bg-[#D92A2A] hover:scale-105 transition-all duration-300 z-50"
    >
      <div className="relative flex items-center">
        <FaShoppingCart size={18} className="text-white" />
        <span className="absolute -top-2 -right-2 bg-white text-[#B4161B] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
          {totalItems}
        </span>
      </div>
      <span className="text-sm font-semibold tracking-wide">Cart</span>
    </button>
  );
};

export default FloatingCartButton;

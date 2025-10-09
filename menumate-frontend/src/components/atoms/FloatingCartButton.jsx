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
      className="fixed bottom-20 right-5 sm:right-8 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-[#1a1a1a] font-semibold flex items-center gap-2 shadow-lg shadow-amber-800/40 hover:shadow-amber-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-md animate-slideUp z-50"
    >
      <div className="relative flex items-center">
        <FaShoppingCart size={18} className="text-[#1a1a1a]" />
        <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-amber-400 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-inner shadow-amber-600/40">
          {totalItems}
        </span>
      </div>
      <span className="text-sm font-semibold tracking-wide">Cart</span>
    </button>
  );
};

export default FloatingCartButton;

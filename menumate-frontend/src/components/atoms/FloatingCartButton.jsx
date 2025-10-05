// src/components/atoms/FloatingCartButton.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // We'll install this package later

const FloatingCartButton = () => {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);

  if (totalItems === 0) {
    return null; // Don't render if the cart is empty
  }

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 bg-primary text-blue-600 p-4 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
      aria-label="View Cart"
    >
      <div className="relative">
        <FaShoppingCart size={24} />
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-accent text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;
// src/components/molecules/MenuItemCard.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, incrementItemQuantity, decrementItemQuantity, selectCartItemById } from '../../features/cart/cartSlice';
import { FaPlus, FaMinus } from 'react-icons/fa';

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  
  // Custom selector to find the item in the cart by its ID
  const cartItem = useSelector(selectCartItemById(item._id));
  
  // Logic Fixes: Explicitly check for boolean/string representation from backend
  const itemIsAvailable = item.isAvailable === true || item.isAvailable === 'true';
  const itemIsVegetarian = item.isVegetarian === true || item.isVegetarian === 'true';

  const handleIncrement = () => {
    if (!cartItem) {
      dispatch(addItemToCart(item));
    } else {
      dispatch(incrementItemQuantity(item._id));
    }
  };
  
  const handleDecrement = () => {
    if (cartItem && cartItem.quantity > 0) {
      dispatch(decrementItemQuantity(item._id));
    }
  };

  const formattedPrice = item.price ? `₹${item.price.toFixed(2)}` : 'N/A';

  const QuantitySelector = () => (
    <div className="flex items-center space-x-2 border border-orange-500 rounded-full text-orange-500">
        <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center text-lg rounded-full transition hover:bg-orange-50"
        >
            <FaMinus size={10} />
        </button>
        <span className="font-bold text-sm text-secondary">
            {cartItem.quantity}
        </span>
        <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center text-lg rounded-full transition hover:bg-orange-50"
        >
            <FaPlus size={10} />
        </button>
    </div>
  );

  const AddButton = () => (
    <button
        onClick={handleIncrement}
        className="flex items-center space-x-1 bg-green-900 text-white rounded-full px-3 py-1 text-sm font-medium transition hover:bg-orange-50"
    >
        <FaPlus size={10} />
        <span>Add</span>
    </button>
  );

  return (
    // Row container for the list format
    <div className="flex justify-between items-center py-3 border-b border-dashed border-orange-300 last:border-b-0">
        
        {/* Left Section: Image, Icon, and Details */}
        <div className="flex items-center space-x-3">
            {/* ITEM IMAGE THUMBNAIL */}
            {item.image?.url && (
                <img
                    src={item.image.url}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
            )}

            <div className="flex items-start space-x-3">
                {/* Veg/Non-Veg Icon */}
                <div className={`w-3 h-3 border ${itemIsVegetarian ? 'border-green-500' : 'border-red-500'} flex items-center justify-center mt-1.5 flex-shrink-0`}>
                    <div className={`w-1 h-1 rounded-full ${itemIsVegetarian ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>

                {/* Item Name and Price */}
                <div>
                    <p className="font-semibold text-secondary">{item.name}</p>
                    <p className="text-sm text-primary font-bold mt-1">{formattedPrice}</p>
                </div>
            </div>
        </div>

        {/* Right Section: Add Button / Quantity Selector / Out of Stock */}
        {itemIsAvailable ? (
            <div className="min-w-[100px] text-right flex-shrink-0">
                {cartItem ? <QuantitySelector /> : <AddButton />}
            </div>
        ) : (
            <span className="text-red-500 text-sm font-semibold flex-shrink-0">Out of Stock</span>
        )}
    </div>
  );
};

export default MenuItemCard;
// src/components/molecules/MenuItemCard.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  incrementItemQuantity,
  decrementItemQuantity,
  selectCartItemById,
} from "../../features/cart/cartSlice";
import { FaPlus, FaMinus } from "react-icons/fa";

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(item._id));

  const itemIsAvailable =
    item.isAvailable === true || item.isAvailable === "true";
  const itemIsVegetarian =
    item.isVegetarian === true || item.isVegetarian === "true";

  const handleIncrement = () => {
    if (!cartItem) dispatch(addItemToCart(item));
    else dispatch(incrementItemQuantity(item._id));
  };

  const handleDecrement = () => {
    if (cartItem && cartItem.quantity > 0)
      dispatch(decrementItemQuantity(item._id));
  };

  const formattedPrice = item.price ? `₹${item.price.toFixed(2)}` : "N/A";

  // --- Quantity Selector (Red Theme) ---
  const QuantitySelector = () => (
    <div className="flex items-center justify-between w-[80px] border border-[#B4161B] rounded-full text-[#B4161B] bg-white shadow-sm">
      <button
        onClick={handleDecrement}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#B4161B] hover:text-white transition"
      >
        <FaMinus size={8} />
      </button>
      <span className="font-semibold text-[12px]">{cartItem.quantity}</span>
      <button
        onClick={handleIncrement}
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#B4161B] hover:text-white transition"
      >
        <FaPlus size={8} />
      </button>
    </div>
  );

  // --- Add Button (Red Rounded) ---
  const AddButton = () => (
    <button
      onClick={handleIncrement}
      className="bg-[#B4161B] text-white rounded-full px-4 py-1.5 text-[12px] font-semibold shadow-md hover:bg-[#D92A2A] transition-all duration-300"
    >
      Add
    </button>
  );

  return (
    <div className="flex items-center justify-between px-3 py-3 mb-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Left: Image + Text */}
      <div className="flex items-center space-x-3 min-w-0">
        {item.image?.url && (
          <img
            src={item.image.url}
            alt={item.name}
            className="w-14 h-14 object-cover rounded-xl shadow-sm"
          />
        )}

        <div className="min-w-0">
          <div className="flex items-center space-x-1">
            {/* Veg/Non-Veg Dot */}
            <div
              className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                itemIsVegetarian ? "border-green-500" : "border-red-500"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  itemIsVegetarian ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>

            {/* Item Name */}
            <p className="font-medium text-[14px] text-[#1E1E1E] truncate max-w-[150px] sm:max-w-[220px]">
              {item.name}
            </p>
          </div>

          {/* Price */}
          <p className="text-[13px] text-[#B4161B] font-semibold mt-0.5">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* Right: Add / Quantity */}
      <div className="ml-2 flex-shrink-0">
        {itemIsAvailable ? (
          cartItem ? (
            <QuantitySelector />
          ) : (
            <AddButton />
          )
        ) : (
          <span className="text-[#B4161B] text-[11px] font-medium opacity-70">
            Out of Stock
          </span>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;

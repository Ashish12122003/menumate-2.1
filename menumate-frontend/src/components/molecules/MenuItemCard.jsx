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

  // --- Quantity Selector ---
  const QuantitySelector = () => (
    <div className="flex items-center justify-between w-[70px] border border-amber-500 rounded-full text-amber-400 bg-[#1f1f1f]/60 shadow-inner shadow-amber-700/20">
      <button
        onClick={handleDecrement}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-amber-500/10 transition"
      >
        <FaMinus size={8} />
      </button>
      <span className="font-semibold text-[11px]">{cartItem.quantity}</span>
      <button
        onClick={handleIncrement}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-amber-500/10 transition"
      >
        <FaPlus size={8} />
      </button>
    </div>
  );

  const AddButton = () => (
    <button
      onClick={handleIncrement}
      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-[#1a1a1a] rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm hover:shadow-amber-400/30 transition-all duration-300"
    >
      Add
    </button>
  );

  return (
    <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-xl bg-gradient-to-b from-[#1c1c1c] to-[#252525] border border-[#2d2d2d] hover:border-amber-500/30 transition-all duration-300 shadow-sm shadow-black/20 hover:shadow-amber-900/20">
      {/* Left side: image + text */}
      <div className="flex items-center space-x-3 min-w-0">
        {item.image?.url && (
          <img
            src={item.image.url}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg shadow-sm shadow-black/30"
          />
        )}

        <div className="min-w-0">
          <div className="flex items-center space-x-1">
            <div
              className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                itemIsVegetarian ? "border-green-500" : "border-red-500"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${
                  itemIsVegetarian ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <p className="font-medium text-[13px] text-gray-100 truncate max-w-[150px] sm:max-w-[220px]">
              {item.name}
            </p>
          </div>
          <p className="text-[12px] text-amber-400 font-bold mt-0.5">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* Right side: buttons */}
      <div className="ml-2 flex-shrink-0">
        {itemIsAvailable ? (
          cartItem ? (
            <QuantitySelector />
          ) : (
            <AddButton />
          )
        ) : (
          <span className="text-red-400 text-[11px] font-medium">
            Out of Stock
          </span>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;

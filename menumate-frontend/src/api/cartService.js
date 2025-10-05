// src/api/cartService.js
import apiClient from './axios';

/**
 * Syncs the entire cart with backend.
 * Handles both array and object cart formats.
 */
export const syncCart = async (cartData) => {
  try {
    // 🧠 Handle both cases: array or object with items
    const cartItems = Array.isArray(cartData)
      ? cartData
      : cartData?.items || [];

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.warn("⚠️ No items to sync in cart");
      return { success: false, message: "Cart is empty" };
    }

    // ✅ Send each item sequentially
    for (const item of cartItems) {
      await apiClient.post('/cart', {
        menuItemId: item.menuItemId || item.menuItem || item._id,
        quantity: item.quantity,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Cart Sync Error:", error);
    throw new Error("Failed to sync cart");
  }
};

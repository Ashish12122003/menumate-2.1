// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { syncCart } from '../../api/cartService';

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  table: null,
};

// Helper function to calculate totals
const updateTotals = (state) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Sync cart with backend (full cart)
export const syncCartWithBackend = createAsyncThunk(
  'cart/syncCartWithBackend',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await syncCart(cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync cart.');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTable: (state, action) => {
      state.table = action.payload;
    },

    addItemToCart: (state, action) => {
      const newItem = action.payload; // { menuItem, name, price, shop }
      const existingItem = state.items.find(
        item => item.menuItem === newItem.menuItem && item.shop === newItem.shop
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      updateTotals(state);
    },

    incrementItemQuantity: (state, action) => {
      const item = state.items.find(i => i.menuItem === action.payload);
      if (item) {
        item.quantity += 1;
      }
      updateTotals(state);
    },

    decrementItemQuantity: (state, action) => {
      const index = state.items.findIndex(i => i.menuItem === action.payload);
      if (index > -1) {
        const item = state.items[index];
        if (item.quantity === 1) {
          state.items.splice(index, 1);
        } else {
          item.quantity -= 1;
        }
      }
      updateTotals(state);
    },

    removeItem: (state, action) => {
      const index = state.items.findIndex(i => i.menuItem === action.payload);
      if (index > -1) state.items.splice(index, 1);
      updateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      state.table = null;
    },
  },
});

export const selectCartItemById = (menuItemId) => (state) =>
  state.cart.items.find(item => item.menuItem === menuItemId);

export const { addItemToCart, incrementItemQuantity, decrementItemQuantity, removeItem, clearCart, setTable} = cartSlice.actions;

export default cartSlice.reducer;

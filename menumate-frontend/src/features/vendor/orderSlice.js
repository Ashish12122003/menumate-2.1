// src/features/vendor/orderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersForVendorShop, updateVendorOrderStatus } from '../../api/vendorService'; // We will add these functions next

export const fetchOrdersForShop = createAsyncThunk(
  'vendorOrder/fetchOrdersForShop',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await getOrdersForVendorShop(shopId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders.');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'vendorOrder/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await updateVendorOrderStatus(orderId, status);
      return response.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status.');
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const vendorOrderSlice = createSlice({
  name: 'vendorOrder',
  initialState,
  reducers: {
    // This is for new orders coming from WebSocket
    newOrderReceived: (state, action) => {
      state.orders.unshift(action.payload);
    },
    // This is for status updates coming from WebSocket
    updateOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const existingOrder = state.orders.find(order => order._id === orderId);
      if (existingOrder) {
        existingOrder.orderStatus = newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersForShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersForShop.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersForShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      });
  },
});

export const { newOrderReceived } = vendorOrderSlice.actions;
export default vendorOrderSlice.reducer;
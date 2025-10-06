import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { placeNewOrder, fetchOrderById as fetchOrderApi, fetchUserOrders as getUserOrders } from '../../api/orderService';

// --- Async Thunks ---
// 1. Place a new order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const order = await placeNewOrder(orderData);
      dispatch(orderPlaced(order));
      return order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order.');
    }
  }
);

// 2. Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const order = await fetchOrderApi(orderId);
      return order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order.');
    }
  }
);

// 3. Fetch all orders of the logged-in user
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getUserOrders(); // returns array of orders
      return orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user orders.');
    }
  }
);

// --- Initial State ---
const initialState = {
  currentOrder: null,    // Single order details
  userOrders: [],        // All orders of the user
  reviewableOrders: [],
  loading: false,
  error: null,
};

// --- Slice ---
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderPlaced: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
    },

    setReviewableOrders: (state) => {
      state.reviewableOrders = state.userOrders.filter(
        order => order.orderStatus === 'Completed' && !order.review
      );
    },

    // ✅ Update order status from API or WebSocket
    updateOrderStatus: (state, action) => {
      const { _id, orderStatus } = action.payload; // payload must be full order or { _id, orderStatus }

      if (state.currentOrder?._id === _id) {
        state.currentOrder.orderStatus = orderStatus;
      }

      const index = state.userOrders.findIndex(order => order._id === _id);
      if (index !== -1) {
        state.userOrders[index].orderStatus = orderStatus;
      } else {
        // Optional: add order if not present (useful if WebSocket sends a new order)
        state.userOrders.unshift(action.payload);
      }

      // Update reviewableOrders
      orderSlice.caseReducers.setReviewableOrders(state);
    },

    clearOrder: (state) => {
      state.currentOrder = null;
      state.userOrders = [];
      state.loading = false;
      state.error = null;
      state.reviewableOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // --- placeOrder ---
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; state.error = null; })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.currentOrder = null; })

      // --- fetchOrderById ---
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; state.error = null; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.currentOrder = null; })

      // --- fetchUserOrders ---
      .addCase(fetchUserOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload || [];
        state.error = null;
        orderSlice.caseReducers.setReviewableOrders(state);
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userOrders = [];
      });
  },
});

export const { orderPlaced, updateOrderStatus, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

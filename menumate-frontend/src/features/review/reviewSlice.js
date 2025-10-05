import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getShopReviews as fetchShopReviewsAPI, submitReview as submitReviewAPI } from '../../api/reviewService';

// --- Async Thunks ---

// 1. Fetch all reviews for a shop
export const getShopReviews = createAsyncThunk(
  'review/getShopReviews',
  async (shopId, { rejectWithValue }) => {
    try {
      const data = await fetchShopReviewsAPI(shopId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews.');
    }
  }
);

// 2. Submit a review for a completed order
export const submitReview = createAsyncThunk(
  'review/submitReview',
  async ({ orderId, rating, comment }, { rejectWithValue }) => {
    try {
      const data = await submitReviewAPI(orderId, { rating, comment });
      return data.data; // return review object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review.');
    }
  }
);

// --- Slice ---
const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    shopReviews: [],
    averageRating: 0,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getShopReviews
      .addCase(getShopReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShopReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.shopReviews = action.payload.data || [];
        state.averageRating = action.payload.averageRating || 0;
        state.error = null;
      })
      .addCase(getShopReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // submitReview
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.shopReviews.unshift(action.payload); // add new review at top
        state.successMessage = 'Review submitted successfully!';
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
  }
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;

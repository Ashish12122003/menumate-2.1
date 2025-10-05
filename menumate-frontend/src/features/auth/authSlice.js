// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerOrLoginUser } from '../../api/userService';

// Async thunk to handle user login/registration
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerOrLoginUser(userData);
      localStorage.setItem('customerToken', response.token);
      return response; // Returns the full payload: { token, data/user }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('customerToken') || null,
  isAuthenticated: !!localStorage.getItem('customerToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('customerToken');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        // FIX: Correctly handle nested user data (whether 'user' or generic 'data' is returned)
        state.user = action.payload.user || action.payload.data; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
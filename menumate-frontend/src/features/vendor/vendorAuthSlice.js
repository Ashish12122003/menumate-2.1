// src/features/vendor/vendorAuthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginVendor, getVendorProfile } from '../../api/vendorService';

// Async thunk to handle vendor login
export const loginVendorUser = createAsyncThunk(
  'vendorAuth/loginVendorUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginVendor(credentials);
      // Store the token in localStorage to persist the login session
      localStorage.setItem('vendorToken', response.token);
      return response; // Returns { success, token, data: { ... } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk to fetch the vendor profile
export const fetchVendorProfile = createAsyncThunk(
  'vendorAuth/fetchVendorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVendorProfile();
      return response.vendor; // Assuming getVendorProfile returns { vendor: { ... } }
    } catch (error) {
      localStorage.removeItem('vendorToken'); // Clear token if fetching profile fails
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile.');
    }
  }
);

const initialState = {
  vendor: null,
  token: localStorage.getItem('vendorToken') || null,
  isAuthenticated: !!localStorage.getItem('vendorToken'),
  loading: false,
  error: null,
};

const vendorAuthSlice = createSlice({
  name: 'vendorAuth',
  initialState,
  reducers: {
    logoutVendorUser: (state) => {
      localStorage.removeItem('vendorToken');
      state.vendor = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginVendorUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVendorUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        // FIX: Access the nested vendor data under the 'data' key for login
        state.vendor = action.payload.data;
      })
      .addCase(loginVendorUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.vendor = null;
        state.token = null;
      })
      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        // FIX: The payload is the extracted 'vendor' object
        state.vendor = action.payload;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.vendor = null;
      });
  },
});

export const { logoutVendorUser } = vendorAuthSlice.actions;
export default vendorAuthSlice.reducer;
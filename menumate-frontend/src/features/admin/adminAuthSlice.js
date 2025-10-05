// src/features/admin/adminAuthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAdmin } from '../../api/adminService';
import { getVendorProfile } from '../../api/vendorService'; // Import the function


// Async thunk to handle admin login
export const loginAdminUser = createAsyncThunk(
  'adminAuth/loginAdminUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAdmin(credentials);
      // The fix: Access the role from the 'data' key, not a 'vendor' key
      if (response.data.role !== 'admin') {
        return rejectWithValue('Access denied. You are not an admin.');
      }
      localStorage.setItem('adminToken', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed.');
    }
  }
);

// Async thunk to fetch the admin profile after a refresh
export const fetchAdminProfile = createAsyncThunk(
  'adminAuth/fetchAdminProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVendorProfile();
      return response.vendor;
    } catch (error) {
      localStorage.removeItem('adminToken');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile.');
    }
  }
);


const initialState = {
  admin: null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    logoutAdminUser: (state) => {
      localStorage.removeItem('adminToken');
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.data;
      })
      .addCase(loginAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.admin = null;
        state.token = null;
      })
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        state.admin = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.admin = null;
      });
  },
});

export const { logoutAdminUser } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
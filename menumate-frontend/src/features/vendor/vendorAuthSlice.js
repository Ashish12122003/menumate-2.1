// src/features/vendor/vendorAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginVendor, getVendorProfile } from '../../api/vendorService';

// ---------------------- Async Thunks ----------------------

// Vendor login
export const loginVendorUser = createAsyncThunk(
  'vendorAuth/loginVendorUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginVendor(credentials);
      // Persist token
      localStorage.setItem('vendorToken', response.token);
      return response; // { success, token, data: { ...vendor } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch vendor profile (for hydration or KOT page)
export const fetchVendorProfile = createAsyncThunk(
  'vendorAuth/fetchVendorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVendorProfile();
      return response.vendor; // { vendor object }
    } catch (error) {
      localStorage.removeItem('vendorToken'); // Clear token if invalid
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile.');
    }
  }
);

// ---------------------- Slice ----------------------
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
    // ---------- Login ----------
    builder
      .addCase(loginVendorUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVendorUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.vendor = action.payload.data; // vendor info
      })
      .addCase(loginVendorUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.vendor = null;
        state.error = action.payload;
      });

    // ---------- Fetch Vendor Profile ----------
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.vendor = action.payload;
        state.error = null;
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.vendor = null;
        state.error = action.payload;
      });
  },
});

export const { logoutVendorUser } = vendorAuthSlice.actions;
export default vendorAuthSlice.reducer;

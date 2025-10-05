// src/features/admin/adminSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllFoodCourts, createFoodCourt, getPendingShops, updateShopStatus } from '../../api/adminService';

// Thunks for Admin actions
export const fetchAllFoodCourts = createAsyncThunk(
    'admin/fetchAllFoodCourts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllFoodCourts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch food courts.');
        }
    }
);

export const createNewFoodCourt = createAsyncThunk(
    'admin/createNewFoodCourt',
    async (foodCourtData, { rejectWithValue }) => {
        try {
            const response = await createFoodCourt(foodCourtData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create food court.');
        }
    }
);

export const fetchPendingShops = createAsyncThunk(
    'admin/fetchPendingShops',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPendingShops();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending shops.');
        }
    }
);

export const approveShop = createAsyncThunk(
    'admin/approveShop',
    async (shopId, { rejectWithValue }) => {
        try {
            await updateShopStatus(shopId, 'Approved');
            return shopId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve shop.');
        }
    }
);

export const rejectShop = createAsyncThunk(
    'admin/rejectShop',
    async (shopId, { rejectWithValue }) => {
        try {
            await updateShopStatus(shopId, 'Rejected');
            return shopId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reject shop.');
        }
    }
);

const initialState = {
    foodCourts: [],
    pendingShops: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFoodCourts.fulfilled, (state, action) => {
                state.foodCourts = action.payload;
            })
            .addCase(createNewFoodCourt.fulfilled, (state, action) => {
                state.foodCourts.push(action.payload);
            })
            .addCase(fetchPendingShops.fulfilled, (state, action) => {
                state.pendingShops = action.payload;
            })
            .addCase(approveShop.fulfilled, (state, action) => {
                state.pendingShops = state.pendingShops.filter(shop => shop._id !== action.payload);
            })
            .addCase(rejectShop.fulfilled, (state, action) => {
                state.pendingShops = state.pendingShops.filter(shop => shop._id !== action.payload);
            });
    },
});

export default adminSlice.reducer;
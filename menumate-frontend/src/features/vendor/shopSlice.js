// src/features/vendor/shopSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMyShops,
  getShopCategories,
  getShopMenuItems,
} from '../../api/vendorService';

export const fetchMyShops = createAsyncThunk(
  'shop/fetchMyShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyShops();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shops.');
    }
  }
);

export const fetchShopData = createAsyncThunk(
  'shop/fetchShopData',
  async (shopId, { rejectWithValue }) => {
    try {
      const categoriesData = await getShopCategories(shopId);
      const menuItemsData = await getShopMenuItems(shopId);
      return {
        categories: categoriesData.data,
        menuItems: menuItemsData.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shop data.');
    }
  }
);

const initialState = {
  shops: [],
  selectedShop: null,
  categories: [],
  menuItems: [],
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
    addShop: (state, action) => {
      state.shops.push(action.payload);
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    addMenuItem: (state, action) => {
      state.menuItems.push(action.payload);
    },

    // ✅ EDIT CATEGORY
    updateCategoryInState: (state, action) => {
      const updated = action.payload;
      const index = state.categories.findIndex((c) => c._id === updated._id);
      if (index !== -1) state.categories[index] = updated;
    },

    // ✅ DELETE CATEGORY
    removeCategory: (state, action) => {
      const categoryId = action.payload;
      state.categories = state.categories.filter((c) => c._id !== categoryId);
    },

    // ✅ EDIT MENU ITEM
    updateMenuItemInState: (state, action) => {
      const updated = action.payload;
      const index = state.menuItems.findIndex((m) => m._id === updated._id);
      if (index !== -1) state.menuItems[index] = updated;
    },

    // ✅ DELETE MENU ITEM
    removeMenuItem: (state, action) => {
      const itemId = action.payload;
      state.menuItems = state.menuItems.filter((m) => m._id !== itemId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload || [];
        state.selectedShop = state.shops[0] || null;
      })
      .addCase(fetchMyShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchShopData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.menuItems = action.payload.menuItems;
      })
      .addCase(fetchShopData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.categories = [];
        state.menuItems = [];
      });
  },
});

export const {
  setSelectedShop,
  addShop,
  addCategory,
  addMenuItem,
  updateCategoryInState,
  removeCategory,
  updateMenuItemInState,
  removeMenuItem,
} = shopSlice.actions;

export default shopSlice.reducer;

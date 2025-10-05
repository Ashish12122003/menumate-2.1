// src/features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMenuByQrIdentifier } from "../../api/publicService";

export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (qrIdentifier, { rejectWithValue }) => {
    try {
      const response = await getMenuByQrIdentifier(qrIdentifier);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch menu.");
    }
  }
);

const initialState = {
  shop: null,        // single shop
  shops: [],         // for food court
  categories: [],
  menuItems: [],
  loading: false,
  error: null,
  isFoodCourt: false,
  qrIdentifier: null,
  searchQuery: "",
  table: null,       // table info
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload;
        state.qrIdentifier = action.meta.arg;

        if (!payload) {
          state.shop = null;
          state.shops = [];
          state.categories = [];
          state.menuItems = [];
          state.isFoodCourt = false;
          state.table = null;
          return;
        }

        state.isFoodCourt = payload.isFoodCourt;
        state.table = payload.table || null;

        if (payload.isFoodCourt) {
          // FOOD COURT MODE
          state.shops = payload.shops || [];
          if (state.shops.length > 0) {
            state.categories = state.shops.flatMap(shop => shop.menu || []);

            state.menuItems = state.shops.flatMap(shop =>
              (shop.menu || []).flatMap(cat =>
                (cat.items || []).map(item => ({
                  ...item,
                  price: item.price || 0,
                  isAvailable: item.isAvailable ?? true,
                  shop: shop._id,     // correct shop ID
                  menuItem: item._id, // needed for cart sync
                }))
              )
            );
          } else {
            state.categories = [];
            state.menuItems = [];
          }
        } else {
          // SINGLE SHOP MODE
          state.shop = payload.shop;
          state.categories = payload.menu || [];
          state.menuItems = state.categories.flatMap(cat =>
            (cat.items || []).map(item => ({
              ...item,
              price: item.price || 0,
              isAvailable: item.isAvailable ?? true,
              shop: state.shop?._id,
              menuItem: item._id,
            }))
          );
        }
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.shop = null;
        state.shops = [];
        state.categories = [];
        state.menuItems = [];
        state.table = null;
      });
  },
});

export const { setSearchQuery } = menuSlice.actions;
export default menuSlice.reducer;

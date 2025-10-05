// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './features/menu/menuSlice';
import cartReducer from './features/cart/cartSlice';
import authReducer from './features/auth/authSlice';
import orderReducer from './features/order/orderSlice';
import vendorAuthReducer from './features/vendor/vendorAuthSlice';
import shopReducer from './features/vendor/shopSlice';
import adminAuthReducer from './features/admin/adminAuthSlice'; // New import
import adminReducer from './features/admin/adminSlice';
import vendorOrderReducer from './features/vendor/orderSlice'; // New import
import reviewReducer from './features/review/reviewSlice';

const store = configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    vendorAuth: vendorAuthReducer,
    shops: shopReducer,
    adminAuth: adminAuthReducer,
    admin: adminReducer, // New reducer
    vendorOrder: vendorOrderReducer, // Add the vendor order reducer here
    review: reviewReducer,  // ✅ this is importan
  },
});

export default store;
// src/api/axios.js

import axios from 'axios';
import store from '../store'; // CRITICAL: Import the Redux store instance

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach the correct JWT token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    
    // FIX: Read tokens directly from the live Redux state slices
    const customerToken = state.auth.token; 
    const adminToken = state.adminAuth.token;
    const vendorToken = state.vendorAuth.token;

    let token = null;

    // Prioritization Logic: Customer > Admin > Vendor (for active sessions)
    // The system should primarily run under the customer's session if it exists.
    if (customerToken) {
        token = customerToken;
    } else if (adminToken) {
        token = adminToken;
    } else if (vendorToken) {
        token = vendorToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // No need to delete headers here, as we are managing state in Redux.
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
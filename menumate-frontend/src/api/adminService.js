// src/api/adminService.js

import apiClient from './axios';
import { loginVendor as baseLoginVendor } from './vendorService'; // Import the base login function

// This function acts as a wrapper for admin-specific login logic
export const loginAdmin = async (credentials) => {
    try {
        const response = await baseLoginVendor(credentials); // Use the correct login function
        return response;
    } catch (error) {
        console.error("Error with admin login:", error);
        throw error;
    }
};

// Public API call for food courts
export const getAllFoodCourts = async () => {
    try {
        const response = await apiClient.get('/admin/foodcourts'); // The fix: Use the admin route
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin-specific API calls (requires Admin JWT)
export const createFoodCourt = async (foodCourtData) => {
    try {
        const response = await apiClient.post('/admin/foodcourts', foodCourtData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPendingShops = async () => {
    try {
        const response = await apiClient.get('/manager/pending-shops');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateShopStatus = async (shopId, newStatus) => {
    try {
        const response = await apiClient.patch(`/manager/shops/${shopId}/status`, { status: newStatus });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAdminProfile = async () => {
    try {
        const response = await apiClient.get('/vendor/profile');
        return response.data;
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        throw error;
    }
};

export const createTablesForShop = async (shopId, tablesData) => {
    try {
        const response = await apiClient.post(`/shops/${shopId}/tables`, tablesData);
        return response.data;
    } catch (error) {
        console.error("Error creating tables:", error);
        throw error;
    }
};
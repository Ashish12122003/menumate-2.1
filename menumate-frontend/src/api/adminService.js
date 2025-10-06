// src/api/adminService.js

import apiClient from './axios';
import { loginVendor as baseLoginVendor } from './vendorService'; // Import the base login function

// ---------------- Admin Auth ----------------
export const loginAdmin = async (credentials) => {
    try {
        const response = await baseLoginVendor(credentials);
        return response;
    } catch (error) {
        console.error("Error with admin login:", error);
        throw error;
    }
};

// ---------------- Food Courts ----------------
export const getAllFoodCourts = async () => {
    try {
        const response = await apiClient.get('/admin/foodcourts');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createFoodCourt = async (foodCourtData) => {
    try {
        const response = await apiClient.post('/admin/foodcourts', foodCourtData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ---------------- Shops ----------------
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

// ---------------- Tables ----------------

// Create one or multiple tables for a shop
export const createTablesForShop = async (shopId, tablesData) => {
    try {
        const response = await apiClient.post(`/shops/${shopId}/tables`, tablesData);
        return response.data;
    } catch (error) {
        console.error("Error creating tables:", error);
        throw error;
    }
};

// **NEW**: Fetch all tables for a shop
export const getTablesForShop = async (shopId) => {
    try {
        const response = await apiClient.get(`/shops/${shopId}/tables`);
        // Backend should return { tables: [...] }
        return response.data.data|| [];
    } catch (error) {
        console.error("Error fetching tables for shop:", error);
        throw error;
    }
};

export const deleteTable = async (shopId, qrIdentifier) => {
  try {
    const response = await apiClient.delete(`/shops/${shopId}/tables/${qrIdentifier}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};

// ---------------- Analytics ----------------
export const getShopAnalytics = async (shopId, duration) => {
    try {
        const response = await apiClient.get(`/shops/${shopId}/analytics?duration=${duration}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// src/api/vendorService.js
import apiClient from './axios';

export const loginVendor = async (credentials) => {
  try {
    const response = await apiClient.post('/vendor/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Error with vendor login:", error);
    throw error;
  }
};

export const getMyShops = async () => {
  try {
    const response = await apiClient.get('/shops');
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor's shops:", error);
    throw error;
  }
};

export const updateVendorOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await apiClient.patch(`/vendor/orders/${orderId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const createCategory = async (shopId, categoryData) => {
  try {
    const response = await apiClient.post(`/shops/${shopId}/categories`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (shopId, categoryId, categoryData) => {
  try {
    const response = await apiClient.put(`/shops/${shopId}/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

export const deleteCategory = async (shopId, categoryId) => {
  try {
    const response = await apiClient.delete(`/shops/${shopId}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error;
  }
};

export const getShopCategories = async (shopId) => {
  try {
    const response = await apiClient.get(`/shops/${shopId}/categories`);
    return response.data;
  } catch (error) {
    console.error(`Error getting categories for shop ${shopId}:`, error);
    throw error;
  }
};

export const createMenuItem = async (shopId, formData) => {
  try {
    const response = await apiClient.post(`/shops/${shopId}/menu`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
};

export const updateMenuItem = async (shopId, itemId, data) => {
  try {
    // If caller passed a FormData (e.g. image upload), send multipart headers
    if (data instanceof FormData) {
      const response = await apiClient.put(`/shops/${shopId}/menu/${itemId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      // JSON update
      const response = await apiClient.put(`/shops/${shopId}/menu/${itemId}`, data);
      return response.data;
    }
  } catch (error) {
    console.error(`Error updating menu item ${itemId}:`, error);
    throw error;
  }
};

export const deleteMenuItem = async (shopId, itemId) => {
  try {
    const response = await apiClient.delete(`/shops/${shopId}/menu/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting menu item ${itemId}:`, error);
    throw error;
  }
};

export const getShopMenuItems = async (shopId) => {
  try {
    const response = await apiClient.get(`/shops/${shopId}/menu`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu items for shop ${shopId}:`, error);
    throw error;
  }
};

export const getOrdersForVendorShop = async (shopId, status = '') => {
  try {
    const response = await apiClient.get(`/shops/${shopId}/orders?status=${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createShop = async (shopData) => {
  try {
    const response = await apiClient.post('/shops', shopData);
    return response.data;
  } catch (error) {
    console.error("Error creating shop:", error);
    throw error;
  }
};

export const registerVendor = async (vendorData) => {
  try {
    const response = await apiClient.post('/vendor/register', vendorData);
    return response.data;
  } catch (error) {
    console.error("Error with vendor registration:", error);
    throw error;
  }
};

export const getVendorProfile = async () => {
  try {
    const response = await apiClient.get('/vendor/profile');
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    throw error;
  }
};

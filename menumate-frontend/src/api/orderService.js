// src/api/orderService.js
import apiClient from './axios';

// Place a new order
export const placeNewOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// ✅ Fetch a single order by ID (optional)
export const fetchOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`); // fixed typo
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// ✅ Fetch all orders of the logged-in user
export const fetchUserOrders = async () => {
  try {
    const response = await apiClient.get('/orders'); // no ID needed
    console.log("API Response:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    throw error;
  }
};

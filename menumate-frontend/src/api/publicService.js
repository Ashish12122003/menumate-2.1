// src/api/publicService.js

import apiClient from './axios';

export const getMenuByQrIdentifier = async (qrIdentifier) => {
  try {
    const response = await apiClient.get(`public/menu/${qrIdentifier}`);
    
    return response.data;
  } catch (error) {
    // You can handle specific errors here if needed
    console.error("Error fetching public menu:", error);
    throw error;
  }
};
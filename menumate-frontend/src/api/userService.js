// src/api/userService.js

import apiClient from './axios';

export const registerOrLoginUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/login', userData);
    return response.data;
  } catch (error) {
    console.error("Error with user login:", error);
    throw error;
  }
};
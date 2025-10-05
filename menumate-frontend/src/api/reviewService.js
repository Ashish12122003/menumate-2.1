import apiClient from './axios';

// Fetch all reviews for a shop
export const getShopReviews = async (shopId) => {
  try {
    const response = await apiClient.get(`/shops/${shopId}/reviews`);
    return response.data; // { success, count, averageRating, data: reviews }
  } catch (error) {
    console.error('Error fetching shop reviews:', error);
    throw error;
  }
};

// Submit a review for a completed order
export const submitReview = async (orderId, reviewData) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/review`, reviewData);
    return response.data; // { success, message, data: review }
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

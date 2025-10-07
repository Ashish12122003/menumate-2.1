// src/pages/ReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import BottomNavBar from '../components/organisms/BottomNavBar';
import Button from '../components/atoms/Button';
import ReviewModal from '../components/organisms/ReviewModal';
import { getShopReviews, clearReviewState } from '../features/review/reviewSlice';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReviewsPage = () => {
  const dispatch = useDispatch();
  const { shopId: shopIdParam } = useParams(); // Try to get shopId from URL first
  const { shops } = useSelector((state) => state.menu); // Fallback: get shop from Redux state
  const shopId = shopIdParam || shops?.[0]?._id; // Use URL param or first shop from state

  const { shopReviews, averageRating = 0, loading, error } = useSelector((state) => state.review);
  const { userOrders } = useSelector((state) => state.order);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const reviewableOrders = userOrders?.filter(
    (order) => order.orderStatus === 'Completed' && !order.review
  );

  useEffect(() => {
    if (shopId) {
      dispatch(getShopReviews(shopId));
    }
  }, [dispatch, shopId]);

  const renderStars = (rating) => (
    <div className="flex space-x-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      )}
    </div>
  );

  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading reviews...</div>;

  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="container mx-auto p-4 md:px-8 lg:px-12">
        <h1 className="text-4xl font-bold text-secondary text-center mb-6">Customer Reviews</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center border-t-4 border-primary">
          <p className="text-xl font-medium text-gray-600">Average Rating</p>
          <div className="flex justify-center items-center my-2 space-x-2">
            <p className="text-6xl font-extrabold text-primary">
              {averageRating?.toFixed(1) ?? '0.0'}
            </p>
            <div className="flex flex-col items-start">
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-gray-500 mt-1">{shopReviews.length} Ratings</p>
            </div>
          </div>

          {reviewableOrders?.length > 0 ? (
            <div className="mt-6 pt-4 border-t">
              <p className="text-md text-gray-700 mb-3">Had a great experience?</p>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedOrderId(reviewableOrders[0]._id);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                Leave a Review!
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">You have no orders eligible for review.</p>
          )}
        </div>

        <h2 className="text-2xl font-bold text-secondary mb-4">What Customers Say</h2>
        <div className="space-y-4">
          {shopReviews.length > 0 ? (
            shopReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-accent/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {review.user?.name || 'A MenuMate Customer'}
                  </h3>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 italic">"{review.comment}"</p>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-4 bg-white rounded-lg shadow-sm">
              Be the first to review this shop!
            </p>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        orderId={selectedOrderId}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(clearReviewState());
        }}
      />

      <BottomNavBar />
    </div>
  );
};

export default ReviewsPage;

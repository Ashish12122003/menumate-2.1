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
  const { shopId: shopIdParam } = useParams();
  const { shops } = useSelector((state) => state.menu);
  const shopId = shopIdParam || shops?.[0]?._id;

  const { shopReviews, averageRating = 0, loading, error } = useSelector((state) => state.review);
  const { userOrders } = useSelector((state) => state.order);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const reviewableOrders = userOrders?.filter(
    (order) => order.orderStatus === 'Completed' && !order.review
  );

  useEffect(() => {
    if (shopId) dispatch(getShopReviews(shopId));
  }, [dispatch, shopId]);

  const renderStars = (rating) => (
    <div className="flex space-x-0.5 text-sm">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rating ? (
          <FaStar key={i} className="text-amber-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-500" />
        )
      )}
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#110D09] text-gray-300 text-sm">
        Loading reviews...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-[#110D09] text-red-500 text-sm">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-[#211B14] to-[#110D09] text-gray-200 min-h-screen pb-24 text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 text-center mb-4">
          Customer Reviews
        </h1>

        <div className="bg-black/20 border border-white/10 rounded-xl p-4 mb-6 text-center">
          <p className="text-base font-medium text-gray-400">Average Rating</p>
          <div className="flex justify-center items-center my-1 space-x-2">
            <p className="text-4xl sm:text-5xl font-extrabold text-amber-400">
              {averageRating?.toFixed(1) ?? '0.0'}
            </p>
            <div className="flex flex-col items-start">
              {renderStars(Math.round(averageRating))}
              <p className="text-xs text-gray-500 mt-1">{shopReviews.length} Ratings</p>
            </div>
          </div>

          {reviewableOrders?.length > 0 ? (
            <div className="mt-4 pt-2 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Had a great experience?</p>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedOrderId(reviewableOrders[0]._id);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto text-sm py-1 px-2"
              >
                Leave a Review!
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-gray-500 text-xs">You have no orders eligible for review.</p>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-2">What Customers Say</h2>
        <div className="space-y-2">
          {shopReviews.length > 0 ? (
            shopReviews.map((review) => (
              <div
                key={review._id}
                className="bg-black/20 border border-white/10 rounded-xl p-3"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm sm:text-base font-semibold text-amber-400">
                    {review.user?.name || 'A MenuMate Customer'}
                  </h3>
                  {renderStars(review.rating)}
                </div>
                <p className="text-xs text-gray-400 italic">"{review.comment}"</p>
                <p className="text-[10px] text-gray-500 mt-1 text-right">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-3 bg-black/20 rounded-xl border border-white/10 text-xs">
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

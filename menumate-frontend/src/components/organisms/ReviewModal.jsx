import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, clearReviewState } from '../../features/review/reviewSlice';
import { FaStar } from 'react-icons/fa';
import Button from '../atoms/Button';

const ReviewModal = ({ isOpen, onClose, orderId }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating!');
    dispatch(submitReview({ orderId, rating, comment }))
      .unwrap()
      .then(() => {
        setRating(0);
        setHoverRating(0);
        setComment('');
        onClose();
      })
      .catch(() => {});
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#211B14] text-gray-200 rounded-xl shadow-lg w-11/12 max-w-md p-6 relative border border-white/10">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          onClick={() => {
            dispatch(clearReviewState());
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Leave a Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={30}
                className={`cursor-pointer transition-colors duration-150 ${
                  star <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-600'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            className="w-full border border-white/20 rounded-lg p-2 bg-black/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            rows={4}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-amber-500 text-black hover:bg-amber-600 transition-all shadow-md"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => {
            dispatch(clearReviewState());
            onClose();
          }}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Leave a Review</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            {[1,2,3,4,5].map((star) => (
              <FaStar
                key={star}
                size={30}
                className={`cursor-pointer ${star <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            className="w-full border rounded-md p-2"
            rows={4}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

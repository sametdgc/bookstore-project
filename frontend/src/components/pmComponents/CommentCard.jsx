import React from 'react';
import { useNavigate } from 'react-router-dom';
import { renderStars } from '../../components/ReviewWindow';


const CommentCard = ({ review, onApprove, onDisapprove }) => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 rounded-lg shadow p-4 items-center">
      {/* Book Image */}
      <div
        className="w-24 h-32 flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/books/${review.book_id}`)}
      >
        <img
          src={review.books?.image_url || 'https://via.placeholder.com/100x150'}
          alt={review.books?.title || 'Book Cover'}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Comment Details */}
      <div className="flex-1 ml-4">
        <p className="text-sm font-semibold text-gray-500">Review ID: {review.review_id}</p>
        <p className="text-lg font-semibold text-gray-800">
          {review.books?.title || 'Unknown Book'}
        </p>
        <p className="text-sm text-gray-500">
          <strong>User:</strong> {review.users?.full_name || 'Anonymous'}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Comment:</strong> {review.comment}
        </p>
        <div className="mt-2 flex items-center">
          {renderStars(review.rating)}
          <span className="ml-2 text-sm text-gray-700">{review.rating} / 5</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onApprove(review.review_id)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Approve
        </button>
        <button
          onClick={() => onDisapprove(review.review_id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Disapprove
        </button>
      </div>
    </div>
  );
};

export default CommentCard;

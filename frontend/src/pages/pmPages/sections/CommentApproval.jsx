import React, { useState, useEffect } from 'react';
import { getPendingReviews, approveReview, disapproveReview } from '../../../services/api';
import CommentCard from '../../../components/pmComponents/CommentCard';

const CommentApproval = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({
    bookId: '',
    rating: '',
    searchQuery: '',
    sortBy: 'created_at',
    sortDirection: 'desc',
    limit: 10,
    offset: 0,
  });

  const fetchReviews = async () => {
    const data = await getPendingReviews(filters);
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const handleApprove = async (reviewId) => {
    await approveReview(reviewId);
    fetchReviews();
  };

  const handleDisapprove = async (reviewId) => {
    await disapproveReview(reviewId);
    fetchReviews();
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
      offset: 0, // Reset pagination
    }));
  };

  const handlePaginationChange = (newOffset) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      offset: newOffset,
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Approve Comments</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by book/user/review ID"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="created_at">Sort by Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p>No pending comments to approve.</p>
        ) : (
          reviews.map((review) => (
            <CommentCard
              key={review.review_id}
              review={review}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between">
        <button
          disabled={filters.offset === 0}
          onClick={() => handlePaginationChange(filters.offset - filters.limit)}
          className="bg-gray-300 p-2 rounded"
        >
          Previous
        </button>
        <button
          disabled={reviews.length < filters.limit}
          onClick={() => handlePaginationChange(filters.offset + filters.limit)}
          className="bg-gray-300 p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CommentApproval;

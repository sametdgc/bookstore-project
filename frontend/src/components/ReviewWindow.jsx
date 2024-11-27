import { useState, useEffect } from 'react';
import { getUserData, getReviewsForBook, submitReview, approveReview, getPendingReviewsForBook } from "../services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export const ClickableStars = ({ rating, setRating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`cursor-pointer ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

export const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillPercentage = Math.min(Math.max(rating - i + 1, 0), 1) * 100;
      stars.push(
        <div key={i} className="relative inline-block text-gray-300" style={{ width: '1em', height: '1em' }}>
          <FontAwesomeIcon icon={faStar} className="text-gray-300 absolute top-0 left-0" />
          <FontAwesomeIcon
            icon={faStar}
            className="text-yellow-500 absolute top-0 left-0"
            style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
          />
        </div>
      );
    }
    return stars;
  };

const ReviewWindow = ({ book }) => {
  const [userRole, setUserRole] = useState(null);
  const [userID, setUserID] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUserData();
      setUserRole(user?.role_id);
      setUserID(user?.user_id);
    };
    fetchUserData();
  }, []);

  // Fetch reviews for the book
  useEffect(() => {
    const fetchReviews = async () => {
      const fetchedReviews = await getReviewsForBook(book.book_id);
      setReviews(fetchedReviews);
    };
    fetchReviews();
  }, [book.book_id]);

  // Fetch pending reviews if the user is a product manager
  useEffect(() => {
    if (userRole === 3) {
      const fetchPendingReviews = async () => {
        const fetchedPendingReviews = await getPendingReviewsForBook(book.book_id);
        setPendingReviews(fetchedPendingReviews);
      };
      fetchPendingReviews();
    }
  }, [userRole, book.book_id]);

  // Handle new comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim() && rating > 0) {
      const success = await submitReview({
        book_id: book.book_id,
        user_id: userID,
        comment: newComment,
        rating,
        approval_status: false,
      });

      if (success) {
        setNewComment("");
        setRating(0);
      }
    }
  };

  // Handle review approval
  const handleApproval = async (reviewId) => {
    const success = await approveReview(reviewId);

    if (success) {
      setPendingReviews((prev) =>
        prev.filter((review) => review.review_id !== reviewId)
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-8 mt-8">
      <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          review.approval_status && (
            <div
              key={review.review_id}
              className="mb-4 p-4 bg-gray-100 rounded-md"
            >
              <p className="font-semibold">{review.user.full_name}</p>
              <p className="text-gray-600">{review.comment}</p>
              <div className="flex items-center">
                <span className="text-yellow-500 font-semibold mr-2">
                  Rating:
                </span>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-black">{review.rating} / 5</span>
                </div>
              </div>
            </div>
          )
        ))
      ) : (
        <p className="text-gray-600 text-lg">No reviews yet!</p>
      )}

      {userRole === 1 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Write a Review</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-2 border rounded-md mt-2"
          />
          <ClickableStars rating={rating} setRating={setRating} />
          <button
            onClick={handleCommentSubmit}
            className="bg-[#65aa92] text-white px-4 py-2 rounded-md mt-2"
          >
            Submit Review
          </button>
        </div>
      )}

      {userRole === 3 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Pending Reviews for Approval</h3>
          {pendingReviews.length > 0 ? (
            pendingReviews.map((review) => (
              <div
                key={review.review_id}
                className="mb-4 p-4 bg-yellow-100 rounded-md"
              >
                <p className="font-semibold">{review.user_id}</p>
                <p className="text-gray-600">{review.comment}</p>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-black">{review.rating} / 5</span>
                </div>
                <button
                  onClick={() => handleApproval(review.review_id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                >
                  Approve
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg">No pending reviews.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewWindow;
import { useState, useEffect } from 'react';
import { getUserData, getReviewsForBook, submitReview, getDeliveredBooks } from "../services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export const ClickableStars = ({ rating, setRating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
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
    const [userID, setUserID] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [deliveredBooks, setDeliveredBooks] = useState([]);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUserData();
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

    // Fetch delivered books for the user
    useEffect(() => {
        const fetchDeliveredBooks = async () => {
            if (userID) {
                const delivered = await getDeliveredBooks(userID);
                setDeliveredBooks(delivered);
            }
        };
        fetchDeliveredBooks();
    }, [userID]);

    const handleCommentSubmit = async () => {
        if (rating > 0) {
            // Determine approval status based on whether a comment is provided
            const approvalStatus = newComment.trim() === "" ? true : false;

            const success = await submitReview({
                book_id: book.book_id,
                user_id: userID,
                comment: newComment.trim() === "" ? null : newComment.trim(),
                rating,
                approval_status: approvalStatus,
            });

            if (success) {
                setNewComment("");
                setRating(0);
            }
        }
    };

    // Check if the user can review this book
    const canReview = deliveredBooks.some((deliveredBook) => deliveredBook.book_id === book.book_id);

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
                                <span className="text-yellow-500 font-semibold mr-2">Rating:</span>
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

            {canReview && (
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
        </div>
    );
};

export default ReviewWindow;

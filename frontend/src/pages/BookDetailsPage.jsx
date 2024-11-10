import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FaHeart } from 'react-icons/fa';
import { getBookDetailsById } from '../services/api';

const BookDetailsPage = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const bookData = await getBookDetailsById(book_id);
      if (bookData) {
        // Calculate average rating if reviews are available
        const totalRating = bookData.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = bookData.reviews.length > 0 ? totalRating / bookData.reviews.length : 0;
        setBook({ ...bookData, ratings: averageRating });
      }
    };

    fetchBookDetails();
  }, [book_id]);

  const handleAddToCart = () => {
    setCartMessage('Product is successfully added to your cart!');
    setTimeout(() => setCartMessage(''), 2000);
  };

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    setWishlistMessage(
      isInWishlist
        ? 'Product is removed from the wishlist.'
        : 'Product is added to wishlist.'
    );
    setTimeout(() => setWishlistMessage(''), 2000);
  };

  if (!book) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const renderStars = (rating) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-16 px-4 relative">
        <div className="bg-white shadow-md rounded-md p-8 flex flex-col md:flex-row items-start md:items-start space-y-8 md:space-y-0 md:space-x-8">
          <div className="md:w-1/4 flex justify-center md:justify-start relative">
            {wishlistMessage && (
              <p className="absolute -top-8 text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                {wishlistMessage}
              </p>
            )}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-2 left-2 p-2 rounded-full border-2 transition ${
                isInWishlist ? 'bg-red-500 text-white border-red-500' : 'text-red-500 border-red-500'
              }`}
            >
              <FaHeart size={24} />
            </button>
            <img
              src={book.image_url || 'https://via.placeholder.com/200x300'}
              alt={`${book.title} cover`}
              className="rounded-lg shadow-lg object-cover"
              style={{ width: '100%', height: '350px', maxWidth: '250px' }}
            />
          </div>
          <div className="md:w-2/4 flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-[#65aa92]">{book.title}</h1>
            <p className="text-2xl text-gray-700">{book.author.author_name}</p>
            <p className="text-md text-gray-600 mt-2">{book.description}</p>
            <div className="text-md text-gray-500 space-y-1">
              <p><span className="font-semibold">Genre:</span> {book.genre.genre_name}</p>
              <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
              <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
              <p><span className="font-semibold">Language:</span> {book.language.language_name}</p>
              <p><span className="font-semibold">Stock:</span> {book.available_quantity}</p>
              <p className="flex items-center">
                <span className="font-semibold">Average Rating:</span>
                <span className="ml-2 flex items-center">
                  {book.reviews.length > 0 ? (
                    <>
                      {renderStars(book.ratings)}
                      <span className="ml-2 text-black">{book.ratings.toFixed(1)} / 5</span>
                    </>
                  ) : (
                    <span className="text-gray-600">No ratings yet.</span>
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className="md:w-1/4 flex flex-col items-center md:items-end justify-center space-y-4 self-stretch">
            <div className="bg-gray-50 p-4 rounded-md shadow-lg text-center font-semibold" style={{ width: '300px', height: '60px' }}>
              <p className="text-2xl text-gray-700">${book.price}</p>
            </div>
            <button
              onClick={book.available_quantity > 0 ? handleAddToCart : null}
              className={`py-2 px-4 rounded-md font-semibold text-xl transition-colors duration-300 ${
                book.available_quantity > 0
                  ? 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white'
                  : 'bg-red-500 text-white cursor-not-allowed'
              }`}
              style={{ width: '300px', height: '50px' }}
              disabled={book.available_quantity === 0}
            >
              {book.available_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <div
              className={`text-sm px-2 py-1 rounded shadow-md text-center transition-opacity duration-300 ${
                cartMessage ? 'opacity-100 bg-gray-200 text-gray-600' : 'opacity-0'
              }`} 
              style={{minHeight: '30px', width: '300px' }} 
            >
              {cartMessage}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md p-8 mt-8">
          <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Reviews</h2>
          {book.reviews.length > 0 ? (
            book.reviews.map((review) => (
              <div key={review.review_id} className="mb-4 p-4 bg-gray-100 rounded-md">
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
            ))
          ) : (
            <p className="text-gray-600 text-lg">No reviews yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { TopNavBar, Footer } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const dummyComments = [
        { user: 'User1', text: 'Amazing book!', rating: 5 },
        { user: 'User2', text: 'Enjoyed every chapter.', rating: 4 },
        { user: 'User3', text: 'Good read but a bit lengthy.', rating: 3 },
        { user: 'User4', text: 'Absolutely loved it!', rating: 5 },
        { user: 'User5', text: 'Not my type.', rating: 2 },
        { user: 'User6', text: 'Great writing!', rating: 4 },
        { user: 'User7', text: 'Interesting story.', rating: 3 },
        { user: 'User8', text: 'Fantastic book, highly recommend.', rating: 5 },
        { user: 'User9', text: 'Pretty good.', rating: 4 },
        { user: 'User10', text: 'Could have been better.', rating: 3 },
        { user: 'User11', text: 'A masterpiece.', rating: 5 },
      ];

      const totalRating = dummyComments.reduce((sum, comment) => sum + comment.rating, 0);
      const averageRating = totalRating / dummyComments.length;

      setBook({
        title: 'Sample Book Title',
        author: 'John Doe',
        genre: 'Fiction',
        published_date: '2023-01-01',
        price: 19.99,
        stock_quantity: 25,
        description: 'This is a sample description of the book. It provides an overview of the plot, themes, and other interesting aspects.',
        imageUrl: 'https://via.placeholder.com/200x300', // Replace with actual URL for book image
        comments: dummyComments,
        ratings: averageRating,
      });
    };

    fetchBookDetails();
  }, [bookId]);

  const handleAddToCart = () => {
    setShowMessage(true);

    // Hide the message after 2 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
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

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="bg-white shadow-md rounded-md p-8 flex flex-col md:flex-row items-start md:items-start space-y-8 md:space-y-0 md:space-x-8">
          
          {/* Book Image */}
          <div className="md:w-1/4 flex justify-center md:justify-start">
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="rounded-lg shadow-lg object-cover"
              style={{ width: '100%', height: '350px', maxWidth: '250px' }}
            />
          </div>

          {/* Book Details */}
          <div className="md:w-2/4 flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-[#65aa92]">{book.title}</h1>
            <p className="text-2xl text-gray-700">Author: {book.author}</p>
            <p className="text-gray-600">{book.description}</p>

            {/* Additional Details */}
            <div className="text-md text-gray-500 space-y-1">
              <p><span className="font-semibold">Genre:</span> {book.genre}</p>
              <p><span className="font-semibold">Published Date:</span> {book.published_date}</p>
              <p><span className="font-semibold">Stock:</span> {book.stock_quantity}</p>
              <p className="flex items-center">
                <span className="font-semibold">Average Rating:</span>
                <span className="ml-2 flex items-center">
                  {renderStars(book.ratings)}
                  <span className="ml-2 text-black">{book.ratings.toFixed(1)} / 5</span>
                </span>
              </p>
            </div>
          </div>

          {/* Price and Add to Cart Section */}
          <div className="md:w-1/4 flex flex-col items-center md:items-end justify-center space-y-4 self-stretch">
            <div className="bg-gray-50 p-4 rounded-md shadow-lg text-center font-semibold" style={{ width: '300px', height: '60px' }}>
              <p className="text-2xl text-gray-700">${book.price}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-white text-red-500 border border-red-500 py-2 px-4 rounded-md font-semibold hover:bg-red-500 hover:text-white transition-colors duration-300 text-xl"
              style={{ width: '300px', height: '50px' }}
            >
              Add to Cart
            </button>

            {/* Reserved Space for Success Message */}
            <p
              className={`text-[#65aa92] font-semibold mt-2 text-sm text-center ${showMessage ? 'visible' : 'invisible'}`}
              style={{ minHeight: '1.5em' , width: '300px'}}
            >
              Product is successfully added to your cart!
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow-md rounded-md p-8 mt-8">
          <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Comments</h2>
          {book.comments.map((comment, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-md">
              <p className="font-semibold">{comment.user}</p>
              <p className="text-gray-600">{comment.text}</p>
              <p className="text-yellow-500">
                <span className="font-semibold">Rating:</span> 
                <span className="text-black"> {comment.rating} / 5</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookDetailsPage;

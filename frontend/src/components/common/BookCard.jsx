// src/components/common/BookCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const BookCard = ({ book, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/books/${book.book_id}`); // Redirect to the BookDetailsPage with the book ID in the URL
  };

  return (
    <div
      onClick={handleCardClick}
      className="border rounded-lg shadow-lg p-4 flex flex-col items-center relative bg-white cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      {/* Heart icon for wishlist */}
      <div
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation(); // Prevents navigating when clicking the heart
          onAddToWishlist(book); // Call the wishlist handler
        }}
      >
        <button className="text-gray-300 hover:text-red-500 transition">
          <FaHeart size={24} />
        </button>
      </div>

      {/* Book image */}
      <img
        src={book.image_url}
        alt={book.title}
        className="w-full h-64 object-cover mb-4 rounded-md"
      />

      {/* Book title */}
      <h2 className="text-lg font-semibold text-center">{book.title}</h2>

      {/* Author name */}
      <p className="text-gray-500 text-sm text-center">{book.author_name}</p>

      {/* Price */}
      <p className="text-gray-800 text-xl font-bold text-center mt-2">
        ${book.price}
      </p>

      {/* Add to Cart button */}
      <div className="mt-auto w-full">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating when clicking "Add to Cart"
            onAddToCart(book);
          }}
          className="w-full bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e] transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;

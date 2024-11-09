import React from "react";
import { FaHeart } from "react-icons/fa";

const BookCard = ({ book }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 flex flex-col items-center relative bg-white">
      {/* Heart icon for wishlist */}
      <div className="absolute top-2 right-2">
        <button className="text-red-500 hover:text-red-600 transition">
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
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default BookCard;

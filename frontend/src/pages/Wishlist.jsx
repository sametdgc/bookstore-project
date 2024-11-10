// src/pages/WishlistPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  const handleRemoveFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((item) => item.book_id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-5xl font-bold mb-12 text-center text-[#65aa92]">Wishlist</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {wishlist.length > 0 ? (
          wishlist.map((book) => (
            <div
              key={book.book_id}
              className="flex items-center justify-between border-b last:border-b-0 py-4"
            >
              {/* Book Image */}
              <img
                src={book.image_url || "https://via.placeholder.com/50x75"}
                alt={book.title}
                className="w-16 h-24 object-cover rounded cursor-pointer"
                onClick={() => handleBookClick(book.book_id)}
              />

              {/* Book Title */}
              <p
                className="text-lg font-semibold text-gray-800 cursor-pointer flex-1 ml-4"
                onClick={() => handleBookClick(book.book_id)}
              >
                {book.title}
              </p>

              {/* Remove Button */}
              <button
                className="text-red-500 hover:text-red-700 text-sm font-semibold ml-4"
                onClick={() => handleRemoveFromWishlist(book.book_id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">Your wishlist is empty!</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

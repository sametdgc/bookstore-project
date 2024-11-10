// src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist items from localStorage when the component mounts
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // Function to remove an item from the wishlist
  const handleRemoveFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((item) => item.book_id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-semibold text-[#65aa92]">Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-lg text-gray-600 mt-4">Your wishlist is currently empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {wishlist.map((book) => (
            <div key={book.book_id} className="border p-4 rounded shadow relative">
              {/* Book Image */}
              <img
                src={book.image_url || "https://via.placeholder.com/150x225"}
                alt={`${book.title} cover`}
                className="rounded-lg object-cover w-full h-64"
              />

              {/* Book Title */}
              <h2 className="text-xl font-bold mt-4">{book.title}</h2>

              {/* Author Name */}
              <p className="text-gray-500 text-sm">{book.author_name}</p>

              {/* Remove from Wishlist Button */}
              <button
                onClick={() => handleRemoveFromWishlist(book.book_id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

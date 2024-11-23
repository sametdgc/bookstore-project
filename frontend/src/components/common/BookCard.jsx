import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const BookCard = ({ book, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");

  useEffect(() => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isBookInWishlist = existingWishlist.some(
      (item) => item.book_id === book.book_id
    );
    setIsInWishlist(isBookInWishlist);
  }, [book.book_id]);

  const handleCardClick = () => {
    navigate(`/books/${book.book_id}`); // Redirect to the BookDetailsPage with the book ID in the URL
  };

  const handleWishlistToggle = () => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let updatedWishlist;

    if (isInWishlist) {
      // Remove from wishlist
      updatedWishlist = existingWishlist.filter(
        (item) => item.book_id !== book.book_id
      );
      setWishlistMessage("Product is removed from the wishlist.");
    } else {
      // Add to wishlist
      updatedWishlist = [...existingWishlist, book];
      setWishlistMessage("Product is added to wishlist.");
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsInWishlist(!isInWishlist);
    setTimeout(() => setWishlistMessage(""), 2000);
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
        <FaHeart
          size={24}
          className={isInWishlist ? "text-red-500" : "text-gray-300"}
          onClick={handleWishlistToggle}
        />
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
            if (book.available_quantity > 0) {
              onAddToCart(book);
            }
          }}
          className={`w-full px-4 py-2 rounded font-semibold text-center transition ${
            book.available_quantity > 0
              ? "bg-[#65aa92] text-white hover:bg-[#4a886e] cursor-pointer"
              : "bg-red-500 text-white cursor-not-allowed"
          }`}
          disabled={book.available_quantity === 0}
        >
          {book.available_quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;

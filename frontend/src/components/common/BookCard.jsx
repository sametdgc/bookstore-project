import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
  fetchUser,
  addItemToCart,
  addItemToLocalCart,
  getWishlistByUserId,
  addBookToWishlist,
  removeBookFromWishlist,
  getLocalWishlistItems,
  addItemToLocalWishlist,
  removeItemFromLocalWishlist,
} from "../../services/api.js";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  // Fetch user and wishlist on component mount
  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      const currentUser = await fetchUser();
      setUser(currentUser);

      if (currentUser) {
        // Logged-in user: Fetch wishlist from the database
        const userId = currentUser.user_metadata.custom_incremented_id;
        const wishlistData = await getWishlistByUserId(userId);
        setWishlist(wishlistData);
        setIsInWishlist(wishlistData.some((item) => item.book_id === book.book_id));
      } else {
        // Anonymous user: Fetch wishlist from localStorage
        const localWishlist = getLocalWishlistItems();
        setWishlist(localWishlist);
        setIsInWishlist(localWishlist.some((item) => item.book_id === book.book_id));
      }
    };

    fetchUserAndWishlist();
  }, [book.book_id]);

  // Add to Cart
  const handleAddToCart = async () => {
    const { book_id, price } = book;

    if (user) {
      // Logged-in user: Add to database cart
      const userId = user.user_metadata.custom_incremented_id;
      await addItemToCart(userId, book_id, 1, price);
    } else {
      // Anonymous user: Add to localStorage cart
      addItemToLocalCart(book_id, 1, price);
    }

    // Show cart success message
    setCartMessage("Product is successfully added to your cart!");
    setTimeout(() => setCartMessage(""), 2000);
  };

  // Add to or Remove from Wishlist
  const handleWishlistToggle = async () => {
    const { book_id } = book;

    if (isInWishlist) {
      // Remove from wishlist
      if (user) {
        const userId = user.user_metadata.custom_incremented_id;
        await removeBookFromWishlist(userId, book_id);
      } else {
        const updatedWishlist = removeItemFromLocalWishlist(book_id);
        setWishlist(updatedWishlist);
      }
    } else {
      // Add to wishlist
      if (user) {
        const userId = user.user_metadata.custom_incremented_id;
        await addBookToWishlist(userId, book_id);
      } else {
        addItemToLocalWishlist(book);
        setWishlist([...wishlist, book]);
      }
    }

    setIsInWishlist(!isInWishlist);
  };

  const handleCardClick = () => {
    navigate(`/books/${book.book_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border rounded-lg shadow-lg p-4 flex flex-col items-center relative bg-white cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      {/* Cart success message */}
      {cartMessage && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-[#65aa92] text-white p-2 rounded-lg shadow-md z-50">
          {cartMessage}
        </div>
      )}

      {/* Wishlist Button */}
      <div
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigating when clicking the heart
          handleWishlistToggle();
        }}
      >
        <FaHeart
          size={24}
          className={isInWishlist ? "text-red-500" : "text-gray-300"}
        />
      </div>

      {/* Book Image */}
      <img
        src={book.image_url}
        alt={book.title}
        className="w-full h-64 object-cover mb-4 rounded-md"
      />

      {/* Book Title */}
      <h2 className="text-lg font-semibold text-center">{book.title}</h2>

      {/* Author Name */}
      <p className="text-gray-500 text-sm text-center">{book.author_name}</p>

      {/* Price */}
      <p className="text-gray-800 text-xl font-bold text-center mt-2">
        ${book.price}
      </p>

      {/* Add to Cart Button */}
      <div className="mt-auto w-full">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating when clicking "Add to Cart"
            if (book.available_quantity > 0) {
              handleAddToCart();
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

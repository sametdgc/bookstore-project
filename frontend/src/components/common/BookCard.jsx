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
  getCurrentDiscount,
} from "../../services/api.js";
import Cookies from "js-cookie";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistMessageColor, setWishlistMessageColor] = useState("");
  const [currentDiscount, setCurrentDiscount] = useState(0);

  const userId = Cookies.get("user_id");

  // Fetch user and wishlist on component mount
  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      // setUser(currentUser);

      if (userId) {
        // Logged-in user: Fetch wishlist from the database
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

    const fetchDiscount = async () => {
      const { data } = await getCurrentDiscount(book.book_id);
      if (data) {
        setCurrentDiscount(data.discount_rate);
      }
    };

    fetchDiscount();
    fetchUserAndWishlist();
  }, [book.book_id]);

  // Add to Cart
  const handleAddToCart = async () => {
    const { book_id, price } = book;

    if (userId) {
      // Logged-in user: Add to database cart
      await addItemToCart(userId, book_id, 1, price);
    } else {
      // Anonymous user: Add to localStorage cart
      addItemToLocalCart(book_id, 1, price);
    }

    // Show cart success message
    setCartMessage("The product is added to your cart!");
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
      setWishlistMessage("The product is removed from your wishlist.");
      setWishlistMessageColor("bg-gray-300");
    } else {
      // Add to wishlist
      if (user) {
        const userId = user.user_metadata.custom_incremented_id;
        await addBookToWishlist(userId, book_id);
      } else {
        addItemToLocalWishlist(book);
        setWishlist([...wishlist, book]);
      }
      setWishlistMessage("The product is added to your wishlist!");
      setWishlistMessageColor("bg-red-500");
    }

    setIsInWishlist(!isInWishlist);
    setTimeout(() => setWishlistMessage(""), 2000);
  };

  const handleCardClick = () => {
    navigate(`/books/${book.book_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative border rounded-lg shadow-lg p-4 flex flex-col items-center bg-white cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      {/* Success messages */}
      {(wishlistMessage || cartMessage) && (
        <div
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${
            wishlistMessage ? wishlistMessageColor : "bg-[#65aa92]"
          } text-white text-sm px-4 py-2 rounded-md shadow-md flex justify-center items-center text-center`}
        >
          {wishlistMessage || cartMessage}
        </div>
      )}

      {/* Wishlist button */}
      <div
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          handleWishlistToggle();
        }}
      >
        <FaHeart size={24} className={isInWishlist ? "text-red-500" : "text-gray-300"} />
      </div>

      {/* Book Image */}
      <img src={book.image_url} alt={book.title} className="w-full h-64 object-cover mb-4 rounded-md" />

      {/* Book Title */}
      <h2 className="text-lg font-semibold text-center">{book.title}</h2>

      {/* Author Name */}
      <p className="text-gray-500 text-sm text-center">{book.author_name}</p>

      {/* Discount and Price Section */}
      <div className="text-center mt-4">
        {currentDiscount > 0 && (
          <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[#4a886e] font-bold text-2xl">
              ${(book.price - book.price * (currentDiscount / 100)).toFixed(2)}
            </span>
          </div>
        )}
        {currentDiscount > 0 ? (
          <p className="text-gray-500 line-through text-sm">${book.price.toFixed(2)}</p>
        ) : (
          <p className="text-gray-800 text-xl font-bold">${book.price.toFixed(2)}</p>
        )}
      </div>
      
      {/* Add to Cart button */}
      <div className="mt-auto w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
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

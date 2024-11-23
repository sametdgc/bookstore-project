import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/common/BookCard";
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
} from "../services/api";

const SearchPage = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const { state } = useLocation(); // State passed from the SearchBar

  // Fetch the current user and their wishlist on component mount
  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      const currentUser = await fetchUser();
      setUser(currentUser);

      if (currentUser) {
        // Logged-in user: Fetch wishlist from database
        const userId = currentUser.user_metadata.custom_incremented_id;
        const wishlistData = await getWishlistByUserId(userId);
        setWishlist(wishlistData);
      } else {
        // Anonymous user: Fetch wishlist from localStorage
        const localWishlist = getLocalWishlistItems();
        setWishlist(localWishlist);
      }
    };

    fetchUserAndWishlist();
  }, []);

  // Set filteredBooks based on the state passed from SearchBar
  useEffect(() => {
    if (state && state.searchResults) {
      setFilteredBooks(state.searchResults);
    }
  }, [state]);

  // Add to Cart function
  const handleAddToCart = async (book) => {
    const { book_id, price } = book;

    if (user) {
      // Logged-in user: Add to the database cart
      const userId = user.user_metadata.custom_incremented_id;
      await addItemToCart(userId, book_id, 1, price);
    } else {
      // Anonymous user: Add to the localStorage cart
      addItemToLocalCart(book_id, 1, price);
    }

    // Display confirmation message
    setCartMessage(`Product is successfully added to your cart!`);
    setTimeout(() => setCartMessage(""), 2000);
  };

  // Add to or Remove from Wishlist function
  const handleWishlistToggle = async (book) => {
    const { book_id } = book;
    const isInWishlist = wishlist.some((item) => item.book_id === book_id);

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

    // Update the wishlist state
    const updatedWishlist = isInWishlist
      ? wishlist.filter((item) => item.book_id !== book_id)
      : [...wishlist, book];
    setWishlist(updatedWishlist);
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      {/* Popup message */}
      {cartMessage && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-[#65aa92] text-white p-4 rounded-lg shadow-lg z-50">
          {cartMessage}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-center text-[#65aa92]">
        Search Results
      </h1>

      {/* Check if there are no results and display a message */}
      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">No results found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.book_id}
              book={book}
              onAddToCart={() => handleAddToCart(book)}
              onAddToWishlist={() => handleWishlistToggle(book)}
              isInWishlist={wishlist.some((item) => item.book_id === book.book_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

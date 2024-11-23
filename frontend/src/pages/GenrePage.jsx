import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getBooksByGenre,
  getGenreIdByName,
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
import BookCard from "../components/common/BookCard";

const GenrePage = () => {
  const { genreName } = useParams();
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchBooksAndWishlist = async () => {
      try {
        // Fetch genre ID and books
        const genreId = await getGenreIdByName(genreName);
        const booksData = await getBooksByGenre(genreId);

        // Fetch current user (if logged in)
        const currentUser = await fetchUser();

        setBooks(booksData);
        setUser(currentUser);

        if (currentUser) {
          // Logged-in user: Fetch wishlist from the database
          const userId = currentUser.user_metadata.custom_incremented_id;
          const wishlistData = await getWishlistByUserId(userId);
          setWishlist(wishlistData);
        } else {
          // Anonymous user: Fetch wishlist from localStorage
          const localWishlist = getLocalWishlistItems();
          setWishlist(localWishlist);
        }
      } catch (error) {
        console.error("Error fetching books or wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndWishlist();
  }, [genreName]);

  // Add to Cart function
  const handleAddToCart = async (book) => {
    const { book_id, price } = book;

    if (user) {
      // Logged-in user: Add to the database cart
      const userId = user.user_metadata.custom_incremented_id;
      await addItemToCart(userId, book_id, 1, price); // Add 1 quantity
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Popup message */}
      {cartMessage && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-[#65aa92] text-white p-4 rounded-lg shadow-lg z-50">
          {cartMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center capitalize">
        {genreName}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.book_id}
            book={book}
            onAddToCart={() => handleAddToCart(book)}
            onAddToWishlist={() => handleWishlistToggle(book)}
            isInWishlist={wishlist.some((item) => item.book_id === book.book_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;

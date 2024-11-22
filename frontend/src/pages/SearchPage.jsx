import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/common/BookCard";
import { fetchUser, addItemToCart, addItemToLocalCart } from "../services/api";

const SearchPage = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [user, setUser] = useState(null); 
  const [cartMessage, setCartMessage] = useState(""); 
  const { state } = useLocation(); 

  // Fetch the current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await fetchUser();
      setUser(currentUser); 
    };

    fetchCurrentUser();
  }, []);

  // If state is passed and contains search results, set the filteredBooks state
  useEffect(() => {
    if (state && state.searchResults) {
      setFilteredBooks(state.searchResults); // Set filteredBooks to the search results passed from SearchBar
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
              onAddToCart={() => handleAddToCart(book)} // Pass the function here
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

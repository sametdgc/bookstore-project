import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/common/BookCard";

const SearchPage = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const { state } = useLocation(); // Get search results passed from SearchBar

  useEffect(() => {
    if (state && state.searchResults) {
      setFilteredBooks(state.searchResults); // Set filtered books from search results
    }
  }, [state]);

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#65aa92]">
        Search Results
      </h1>

      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">No results found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.book_id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

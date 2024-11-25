import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/common/BookCard";
import SearchFilter from "../components/SearchFilter"; // Reusable filter component
import { getAllBooks, getGenres } from "../services/api"; // API services

const SearchPage = () => {
  const [allBooks, setAllBooks] = useState([]); // Stores all books
  const [filteredBooks, setFilteredBooks] = useState([]); // Stores filtered books
  const [loading, setLoading] = useState(false); // Loading state for books
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false); // Track collapse state

  const { state } = useLocation(); // Access state from navigation

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        if (state && state.books) {
          setAllBooks(state.books);
          setFilteredBooks(state.books);
        } else {
          const booksData = await getAllBooks(100, 0);
          setAllBooks(booksData);
          setFilteredBooks(booksData);
        }
      } catch (err) {
        console.error("Error fetching books:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [state]);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    const { genre_ids, minPrice, maxPrice } = filters;

    const filtered = allBooks.filter((book) => {
      const matchesGenre =
        genre_ids.length === 0 || genre_ids.includes(book.genre_id);
      const matchesPrice =
        book.price >= minPrice && book.price <= maxPrice;

      return matchesGenre && matchesPrice;
    });

    setFilteredBooks(filtered);
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#65aa92]">
        Search Page
      </h1>

      <div className="flex gap-4">
        {/* Search Filter */}
        <div
          className={`transition-all duration-300 ${
            isFilterCollapsed ? "w-16" : "w-64"
          }`}
        >
          <SearchFilter
            onFilterChange={handleFilterChange}
            fetchGenres={getGenres}
            onCollapseChange={setIsFilterCollapsed} // Pass setter for collapse
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading books...</p>
            ) : filteredBooks.length === 0 ? (
              <p className="text-center text-gray-500">No results found.</p>
            ) : (
              filteredBooks.map((book) => <BookCard key={book.book_id} book={book} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

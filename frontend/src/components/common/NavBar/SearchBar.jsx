import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { searchBooks } from "../../../services/api"; // Import the searchBooks function
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Import the magnifier icon

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Perform the search using the API function
  const performSearch = async () => {
    if (query.length > 2) {
      setIsLoading(true);
      const data = await searchBooks(query);
      setResults(data.slice(0, 4)); // Display only the top 4 results
      setIsLoading(false);
    }
  };

  // Trigger search on input change (debounced)
  useEffect(() => {
    if (query.length > 2) {
      const debounce = setTimeout(performSearch, 300);
      return () => clearTimeout(debounce);
    } else {
      setResults([]); // Clear results when query is too short
    }
  }, [query]);

  // Handle search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      navigate("/search", { state: { searchResults: results } }); // Redirect to search page on Enter key
    }
  };

  // Handle magnifying glass click for search
  const handleSearchClick = () => {
    if (results.length > 0) {
      navigate("/search", { state: { searchResults: results } }); // Redirect to search page on click
    }
  };

  return (
    <div className="hidden md:flex flex-grow mx-4 relative max-w-2xl">
      <input
        type="text"
        placeholder="Search for books, categories, authors..."
        className="w-full px-4 py-2 rounded-md text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // Listen for Enter key press
      />
      <button
        onClick={handleSearchClick} // Trigger search on button click
        className="absolute right-4 top-2 text-gray-600 hover:text-[#65aa92] focus:outline-none"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      {results.length > 0 && query && (
        <ul className="absolute left-0 w-full mt-12 bg-white border rounded-md shadow-md max-h-80 overflow-y-auto z-50">
          {results.map((book) => (
            <li
              key={book.book_id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/books/${book.book_id}`)} // Navigate to the book's page on click
            >
              <img
                src={book.image_url}
                alt={book.title}
                className="w-12 h-16 object-cover mr-4 rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-black font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author.author_name}</p>
                <p className="text-sm font-bold text-gray-500">${book.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isLoading && <div className="absolute right-4 top-2 text-gray-400 mr-[24px]">Loading...</div>}
    </div>
  );
};

export default SearchBar;

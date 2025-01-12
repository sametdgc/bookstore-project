import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchBooks } from "../../../services/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBarRef = useRef(null);
  const inputRef = useRef(null); // Create a ref for the input element
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const performSearch = async () => {
    if (query.length > 2) {
      setIsLoading(true);
      const data = await searchBooks(query);
      setResults(data);
      setIsLoading(false);
      setIsDropdownOpen(true);
    }
  };

  useEffect(() => {
    if (query.length > 2) {
      const debounce = setTimeout(performSearch, 300);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  }, [query]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      navigate("/search", { state: { books: results } });
      setIsDropdownOpen(false);
      inputRef.current.blur(); // Remove focus from the input on Enter
    }
  };

  const handleSearchClick = () => {
    if (results.length > 0) {
      navigate("/search", { state: { books: results } });
      setIsDropdownOpen(false);
      inputRef.current.blur(); // Remove focus from the input on click
    }
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <div ref={searchBarRef} className="hidden md:flex flex-grow mx-4 relative max-w-2xl">
      <input
        type="text"
        ref={inputRef} // Attach the ref to the input
        placeholder="Search for books, categories, authors..."
        className="w-full px-4 py-2 rounded-md text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
      />
      <button
        onClick={handleSearchClick}
        className="absolute right-4 top-2 text-gray-600 hover:text-[#65aa92] focus:outline-none"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      {isDropdownOpen && results.length > 0 && (
        <ul className="absolute left-0 w-full mt-12 bg-white border rounded-md shadow-md max-h-80 overflow-y-auto z-50">
          {results.slice(0, 6).map((book) => (
            <li
              key={book.book_id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/books/${book.book_id}`)}
            >
              <img
                src={book.image_url}
                alt={book.title}
                className="w-12 h-16 object-cover mr-4 rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-black font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author.author_name}</p>
                <div className="mt-2">
                  {book.discount_rate > 0 ? (
                    <div className="flex flex-col items-start">
                      {/* Discounted Price */}
                      <span className="text-[#4a886e] font-bold text-lg">
                        ${(
                          book.price -
                          book.price * (book.discount_rate / 100)
                        ).toFixed(2)}
                      </span>
                      {/* Original Price */}
                      <p className="text-gray-500 line-through text-sm mt-1">
                        ${book.price.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      {/* Regular Price */}
                      <span className="text-black font-bold text-lg">
                        ${book.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
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

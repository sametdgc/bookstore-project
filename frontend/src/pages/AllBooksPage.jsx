// src/pages/AllBooksPage.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllBooks, getGenres } from "../services/api";
import BookCard from "../components/common/BookCard";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartMessage, setCartMessage] = useState(""); // Popup state
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const pageNum = parseInt(searchParams.get("pageNum")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await getAllBooks(pageSize, (pageNum - 1) * pageSize);
        const genresData = await getGenres();
        setBooks(booksData);
        setGenres(genresData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [pageSize, pageNum]);

  const handleGenreChange = (event) => {
    const selected = event.target.value;
    setSelectedGenre(selected);
    applyFilters(selected, selectedPriceRange, searchQuery);
  };

  const handlePriceChange = (event) => {
    const selected = event.target.value;
    setSelectedPriceRange(selected);
    applyFilters(selectedGenre, selected, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    applyFilters(selectedGenre, selectedPriceRange, query);
  };

  const applyFilters = (genre, price, query) => {
    let filtered = books;
    if (genre) {
      filtered = filtered.filter((book) => book.genre_id === parseInt(genre));
    }
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      filtered = filtered.filter(
        (book) => book.price >= minPrice && book.price <= maxPrice
      );
    }
    if (query) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredBooks(filtered);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setSearchParams({ pageSize: newPageSize, pageNum: 1 });
  };

  const handlePageChange = (newPageNum) => {
    setSearchParams({ pageSize, pageNum: newPageNum });
  };

  // Add to Wishlist function
  const handleAddToWishlist = (book) => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!existingWishlist.find((item) => item.book_id === book.book_id)) {
      const updatedWishlist = [...existingWishlist, book];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    }
  };

  // Add to Cart function
  const handleAddToCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, book];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Display confirmation message
    setCartMessage("Product is successfully added to your cart!");
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
        Books
      </h1>
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between bg-gray-100 p-6 rounded-lg shadow-md">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:border-[#65aa92]"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-40">
            <label htmlFor="genre" className="block text-sm font-semibold mb-1">
              Genre
            </label>
            <select
              id="genre"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#65aa92]"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.genre_id} value={genre.genre_id}>
                  {genre.genre_name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label htmlFor="price" className="block text-sm font-semibold mb-1">
              Price
            </label>
            <select
              id="price"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#65aa92]"
              value={selectedPriceRange}
              onChange={handlePriceChange}
            >
              <option value="">All Prices</option>
              <option value="0-10">$0 - $10</option>
              <option value="10-20">$10 - $20</option>
              <option value="20-30">$20 - $30</option>
              <option value="30-50">$30 - $50</option>
              <option value="50-100">$50 - $100</option>
            </select>
          </div>
          <div className="w-40">
            <label
              htmlFor="pageSize"
              className="block text-sm font-semibold mb-1"
            >
              Page Size
            </label>
            <select
              id="pageSize"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-[#65aa92]"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.book_id}
            book={book}
            onAddToCart={() => handleAddToCart(book)}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8 gap-4">
        <button
          className="p-2 bg-[#65aa92] text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(pageNum - 1)}
          disabled={pageNum === 1}
        >
          Previous
        </button>
        <span className="text-lg">{`Page ${pageNum}`}</span>
        <button
          className="p-2 bg-[#65aa92] text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(pageNum + 1)}
          disabled={filteredBooks.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBooksPage;

import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/api";
import { getGenres } from "../services/api"; // Import getGenres
import BookCard from "../components/common/BookCard";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]); // State to manage the cart

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await getAllBooks();
        const genresData = await getGenres();
        setBooks(booksData);
        setGenres(genresData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  // Add to Cart handler
  const handleAddToCart = (book) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, book];
      // You can store it in localStorage to persist across page refreshes
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Books</h1>

      {/* Filters Section */}
      <div className="flex gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            className="p-3 border rounded w-full"
            placeholder="Search for books"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filters Group (Genre and Price) */}
        <div className="flex gap-4">
          {/* Genre Filter Dropdown */}
          <div className="w-32">
            <label htmlFor="genre" className="block text-lg font-semibold mb-2">
              Genre:
            </label>
            <select
              id="genre"
              className="p-3 border rounded w-full"
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

          {/* Price Filter Dropdown */}
          <div className="w-32">
            <label htmlFor="price" className="block text-lg font-semibold mb-2">
              Price:
            </label>
            <select
              id="price"
              className="p-3 border rounded w-full"
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
        </div>
      </div>

      {/* Display filtered books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.book_id}
            book={book}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default AllBooksPage;

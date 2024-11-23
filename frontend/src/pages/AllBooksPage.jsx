import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllBooks,
  getGenres,
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

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartMessage, setCartMessage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const pageNum = parseInt(searchParams.get("pageNum")) || 1;

  // Fetch books, genres, current user, and wishlist on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await getAllBooks(pageSize, (pageNum - 1) * pageSize);
        const genresData = await getGenres();
        const currentUser = await fetchUser();
        setBooks(booksData);
        setGenres(genresData);
        setFilteredBooks(booksData);
        setUser(currentUser);

        if (currentUser) {
          // Logged-in user: fetch wishlist from the database
          const userId = currentUser.user_metadata.custom_incremented_id;
          const wishlistData = await getWishlistByUserId(userId);
          setWishlist(wishlistData);
        } else {
          // Anonymous user: fetch wishlist from localStorage
          const localWishlist = getLocalWishlistItems();
          setWishlist(localWishlist);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [pageSize, pageNum]);

  // Apply filters for genres, price, and search query
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

  // Pagination handlers
  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setSearchParams({ pageSize: newPageSize, pageNum: 1 });
  };

  const handlePageChange = (newPageNum) => {
    setSearchParams({ pageSize, pageNum: newPageNum });
  };

  // Add to Cart function
  const handleAddToCart = async (book) => {
    const { book_id, price } = book;

    if (user) {
      // Logged-in user: Add to the database cart
      const userId = user.user_metadata.custom_incremented_id;
      await addItemToCart(userId, book_id, 1, price); // Add 1 quantity to the database cart
    } else {
      // Anonymous user: Add to the localStorage cart
      addItemToLocalCart(book_id, 1, price);
    }

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
        Books
      </h1>

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

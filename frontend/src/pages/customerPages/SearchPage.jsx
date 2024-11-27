import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../../components/common/BookCard"; // Reusable book card component
import SearchFilter from "../../components/SearchFilter"; // Reusable filter component
import { getAllBooks, getBookById, getAuthors } from "../../services/api"; // Updated API services

const SearchPage = () => {
  const [allBooks, setAllBooks] = useState([]); // All books
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books
  const [allAuthors, setAllAuthors] = useState([]); // All authors
  const [authors, setAuthors] = useState([]); // Top 10 authors
  const [authorCounts, setAuthorCounts] = useState({}); // Counts for authors
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [loading, setLoading] = useState(false); // Loading state
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false); // Filter collapse state
  const [genreCounts, setGenreCounts] = useState({}); // Counts for genres
  const [languageCounts, setLanguageCounts] = useState({}); // Counts for languages
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order for books

  const { state } = useLocation();

  const booksPerPage = 20; // Number of books per page

  // Fetch books and authors on component mount
  useEffect(() => {
    const fetchBooksAndAuthors = async () => {
      setLoading(true);
      try {
        let booksData;

        if (state?.books) {
          // Sync books passed from routing page with the database
          const bookIds = state.books.map((book) => book.book_id);
          booksData = await getBookById(bookIds); // Fetch updated books by their IDs
        } else {
          // Fallback to fetching all books
          booksData = await getAllBooks(100, 0);
        }

        const authorsData = await getAuthors();

        setAllBooks(booksData);
        setFilteredBooks(booksData);
        setAllAuthors(authorsData);

        updateFilterCounts(booksData, authorsData); // Initialize counts
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooksAndAuthors();
  }, [state]);

  // Function to update filter counts (always based on allBooks)
  const updateFilterCounts = (books, authorsData) => {
    const genreCounts = {};
    const languageCounts = {};
    const authorCounts = {};

    books.forEach((book) => {
      // Count genres
      if (book.genre_id) {
        genreCounts[book.genre_id] = (genreCounts[book.genre_id] || 0) + 1;
      }
      // Count languages
      if (book.language_id) {
        languageCounts[book.language_id] =
          (languageCounts[book.language_id] || 0) + 1;
      }
      // Count authors
      if (book.author_id) {
        authorCounts[book.author_id] =
          (authorCounts[book.author_id] || 0) + 1;
      }
    });

    // Sort authors by book count and limit to top 10
    const topAuthors = authorsData
      .map((author) => ({
        ...author,
        bookCount: authorCounts[author.author_id] || 0,
      }))
      .sort((a, b) => b.bookCount - a.bookCount)
      .slice(0, 10);

    setGenreCounts(genreCounts);
    setLanguageCounts(languageCounts);
    setAuthors(topAuthors); // Only top 10 authors
    setAuthorCounts(authorCounts); // Full counts for display
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    const { genre_ids, language_ids, author_ids, minPrice, maxPrice } = filters;

    const filtered = allBooks.filter((book) => {
      const matchesGenre =
        genre_ids.length === 0 || genre_ids.includes(book.genre_id);
      const matchesLanguage =
        language_ids.length === 0 || language_ids.includes(book.language_id);
      const matchesAuthor =
        author_ids.length === 0 || author_ids.includes(book.author_id);
      const matchesPrice =
        book.price >= minPrice && book.price <= maxPrice;

      return matchesGenre && matchesLanguage && matchesAuthor && matchesPrice;
    });

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort order change
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Get sorted and paginated books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Handle page navigation
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
            onSortChange={handleSortChange}
            onCollapseChange={setIsFilterCollapsed}
            genreCounts={genreCounts}
            languageCounts={languageCounts}
            authorCounts={authorCounts}
            authors={allAuthors}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading books...</p>
            ) : paginatedBooks.length === 0 ? (
              <p className="text-center text-gray-500">No results found.</p>
            ) : (
              paginatedBooks.map((book) => (
                <BookCard key={book.book_id} book={book} />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {filteredBooks.length > booksPerPage && (
            <div className="flex justify-center items-center gap-4 mt-6">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#65aa92] text-white hover:bg-[#4c8a73]"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from(
                { length: Math.ceil(filteredBooks.length / booksPerPage) },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    page === currentPage
                      ? "bg-[#65aa92] text-white"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredBooks.length / booksPerPage)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === Math.ceil(filteredBooks.length / booksPerPage)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#65aa92] text-white hover:bg-[#4c8a73]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

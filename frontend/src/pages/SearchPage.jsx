import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import BookCard from "../components/common/BookCard";
import SearchFilter from "../components/SearchFilter"; // Reusable filter component
import { getAllBooks, getBookById, getAuthors } from "../services/api"; // Updated API services

const SearchPage = () => {
  const [allBooks, setAllBooks] = useState([]); // All books
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books
  const [allAuthors, setAllAuthors] = useState([]); // All authors
  const [authorCounts, setAuthorCounts] = useState({}); // Counts for authors
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [loading, setLoading] = useState(false); // Loading state
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false); // Filter collapse state
  const [genreCounts, setGenreCounts] = useState({}); // Counts for genres
  const [languageCounts, setLanguageCounts] = useState({}); // Counts for languages
  const [sortOrder, setSortOrder] = useState("price-asc"); // Default sort order
  const [searchParams, setSearchParams] = useSearchParams();

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
          const basicBooksData = await getAllBooks(1000, 0); // Fetch basic data
          const bookIds = basicBooksData.map((book) => book.book_id); // Extract IDs
          booksData = await getBookById(bookIds); // Fetch detailed data with reviews
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

  // Save sortOrder to URL whenever it changes
  useEffect(() => {
    const sortOrderFromURL = searchParams.get("sortOrder") || "price-asc";
    setSortOrder(sortOrderFromURL);
  }, [searchParams]);

  // Apply filters from URL on component mount or URL change
  // Parse filters from URL and apply them
  useEffect(() => {
    if (!allBooks.length) return; // Avoid running before books are fetched

    const genre_ids = searchParams.get("genre_ids")
      ? searchParams.get("genre_ids").split(",").map(Number)
      : [];
    const language_ids = searchParams.get("language_ids")
      ? searchParams.get("language_ids").split(",").map(Number)
      : [];
    const author_ids = searchParams.get("author_ids")
      ? searchParams.get("author_ids").split(",").map(Number)
      : [];
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || 100;

    // Only apply filters once without triggering unnecessary updates
    const filters = { genre_ids, language_ids, author_ids, minPrice, maxPrice };
    handleFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allBooks]); // Run only when `searchParams` or `allBooks` change

  // Function to update filter counts
  const updateFilterCounts = (books) => {
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
        languageCounts[book.language_id] = (languageCounts[book.language_id] || 0) + 1;
      }
      // Count authors
      if (book.author_id) {
        authorCounts[book.author_id] = (authorCounts[book.author_id] || 0) + 1;
      }
    });

    setGenreCounts(genreCounts);
    setLanguageCounts(languageCounts);
    setAuthorCounts(authorCounts); // Full counts for display
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    const { genre_ids, language_ids, author_ids, minPrice, maxPrice } = filters;
  
    // Compare current filters with URL parameters to avoid unnecessary updates
    const currentParams = Object.fromEntries(searchParams);
    const newParams = {
      ...(genre_ids.length > 0 && { genre_ids: genre_ids.join(",") }),
      ...(language_ids.length > 0 && { language_ids: language_ids.join(",") }),
      ...(author_ids.length > 0 && { author_ids: author_ids.join(",") }),
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      sortOrder,
    };
  
    if (JSON.stringify(currentParams) !== JSON.stringify(newParams)) {
      setSearchParams(newParams); // Update only if the URL needs to change
    }
  
    // Filter books based on the parameters
    const filtered = allBooks.filter((book) => {
      const matchesGenre = genre_ids.length === 0 || genre_ids.includes(Number(book.genre_id));
      const matchesLanguage = language_ids.length === 0 || language_ids.includes(Number(book.language_id));
      const matchesAuthor = author_ids.length === 0 || author_ids.includes(Number(book.author_id));
      const matchesPrice = book.price >= minPrice && book.price <= maxPrice;
  
      return matchesGenre && matchesLanguage && matchesAuthor && matchesPrice;
    });
  
    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to first page
  };
  

  // Handle sort order change
  const handleSortChange = (order) => {
    setSortOrder(order);
    setSearchParams((prevParams) => ({
      ...Object.fromEntries(prevParams),
      sortOrder: order,
    }));
  };

  // Get sorted and paginated books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOrder.startsWith("price")) {
      return sortOrder === "price-asc" ? a.price - b.price : b.price - a.price;
    }
    else if (sortOrder.startsWith("popularity")) {
      // Calculate average rating for books
      const getRating = (book) => {
        if (!book.reviews || book.reviews.length === 0) return 0;
        const totalRating = book.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        return totalRating / book.reviews.length;
      };
      const ratingA = getRating(a);
      const ratingB = getRating(b);
      return sortOrder === "popularity-high" ? ratingB - ratingA : ratingA - ratingB;
    }
    return 0; // Default fallback
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
            initialFilters={{
              genre_ids: searchParams.get("genre_ids")?.split(",") || [],
              language_ids: searchParams.get("language_ids")?.split(",") || [],
              author_ids: searchParams.get("author_ids")?.split(",") || [],
              minPrice: parseFloat(searchParams.get("minPrice")) || 0,
              maxPrice: parseFloat(searchParams.get("maxPrice")) || 100,
            }}
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

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(filteredBooks.length / booksPerPage)
                }
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

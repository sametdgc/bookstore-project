import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllBooks } from "../services/api";
import BookCard from "../components/common/BookCard";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const pageNum = parseInt(searchParams.get("pageNum")) || 1;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const booksData = await getAllBooks(pageSize, (pageNum - 1) * pageSize);
        setBooks(booksData);
      } catch (err) {
        console.error("Error fetching books:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum]);

  const handlePageChange = (newPageNum) => {
    setSearchParams({ pageSize, pageNum: newPageNum });
  };

  const handleGoToSearchPage = async () => {
    try {
      setLoading(true);
      const allBooks = await getAllBooks(1000, 0); // Fetch all books with a large pageSize
      navigate("/search", { state: { books: allBooks } }); // Send all books to SearchPage
    } catch (err) {
      console.error("Error fetching all books for search:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      {/* Button to Go to Search Page */}
      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-2 bg-[#65aa92] text-white font-semibold rounded-lg hover:bg-[#4c8a73] transition-colors duration-300"
          onClick={handleGoToSearchPage}
          disabled={loading} // Disable the button while loading
        >
          I want to use filters
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center text-[#65aa92]">
        Books
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading books...</p>
      ) : (
        <>
          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.book_id} book={book} />
            ))}
          </div>

          {/* Pagination Controls */}
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
              disabled={books.length < pageSize}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllBooksPage;

import React, { useEffect, useState } from "react";
import { getAllBooks, searchBooks } from "../../../services/api/bookServices";
import { supabase } from "../../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const ProductManagement = () => {
  const [books, setBooks] = useState([]); // State for displaying books
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const booksPerPage = 10; // Number of books per page
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch books from the database
  const fetchBooks = async () => {
    setLoading(true);
    const offset = (page - 1) * booksPerPage; // Calculate the offset for pagination
    const data = await getAllBooks(booksPerPage, offset); // Fetch books with pagination
    if (data) {
      setBooks(data);
    }
    setLoading(false);
  };

  // Search books by title
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchBooks();
    } else {
      setLoading(true);
      const data = await searchBooks(searchQuery);
      if (data) {
        setBooks(data);
      }
      setLoading(false);
    }
  };

  // Remove a book by its ID
  const handleRemove = async (bookId) => {
    const { error } = await supabase.from("books").delete().eq("book_id", bookId);
    if (error) {
      console.error("Error deleting book:", error.message);
      alert("Failed to delete the book. Please try again.");
    } else {
      alert("Book removed successfully!");
      fetchBooks();
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header with Add Book Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Books</h2>
        <Link to="/pm/add-book" className="bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e]">
          Add Book
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search books by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e]"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading books...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4">Book ID</th>
                <th className="border-b p-4">Image</th>
                <th className="border-b p-4">Title</th>
                <th className="border-b p-4">Price</th>
                <th className="border-b p-4">Stock</th>
                <th className="border-b p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.book_id}>
                    <td className="border-b p-4">{book.book_id}</td>
                    <td className="border-b p-4">
                      <img
                        src={book.image_url || "https://via.placeholder.com/50"}
                        alt={book.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="border-b p-4">{book.title}</td>
                    <td className="border-b p-4">${book.price}</td>
                    <td className="border-b p-4">{book.available_quantity || 0}</td>
                    <td className="border-b p-4 space-x-2">
                      <button
                        onClick={() => handleRemove(book.book_id)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={books.length < booksPerPage}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;

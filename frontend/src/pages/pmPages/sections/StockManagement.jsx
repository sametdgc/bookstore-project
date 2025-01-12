import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";

const StockManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newStock, setNewStock] = useState(0);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 5;

  // Fetch books with stock information
  const fetchBooks = async () => {
    setLoading(true);

    try {
      const offset = (page - 1) * booksPerPage;

      // Base query
      let query = supabase
        .from("books")
        .select("*", { count: "exact" })
        .range(offset, offset + booksPerPage - 1)
        .order("book_id", { ascending: true });

      // Apply filters
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        if (!isNaN(searchTerm)) {
          // Search by book_id if it's a number
          query = query.eq("book_id", parseInt(searchTerm, 10));
        } else {
          // Search by title
          query = query.ilike("title", `%${searchTerm}%`);
        }
      }

      if (showOutOfStock) {
        // Show only books with 0 stock
        query = query.eq("available_quantity", 0);
      }

      const { data, count, error } = await query;

      if (error) {
        throw error;
      }

      setBooks(data || []);
      setTotalBooks(count || 0);
    } catch (error) {
      console.error("Error fetching books with stock:", error.message);
      setBooks([]);
      setTotalBooks(0);
    }

    setLoading(false);
  };

  // Handle stock update
  const handleStockUpdate = async () => {
    if (newStock < 0) {
      alert("Stock cannot be negative!");
      return;
    }

    try {
      const { error } = await supabase
        .from("books")
        .update({ available_quantity: newStock })
        .eq("book_id", selectedBook.book_id);

      if (error) {
        throw error;
      }

      alert("Stock updated successfully!");
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      alert("Failed to update stock.");
      console.error("Error updating stock:", error.message);
    }
  };

  // Effect to fetch books on page load and when filters change
  useEffect(() => {
    fetchBooks();
  }, [searchQuery, showOutOfStock, page]);

  // Pagination Controls
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search books by title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOutOfStock}
            onChange={() => {
              setPage(1); // Reset to page 1 when toggling the checkbox
              setShowOutOfStock((prev) => !prev);
            }}
          />
          <span>Show Out of Stock</span>
        </label>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4">Book</th>
                <th className="border-b p-4">Book ID</th>
                <th className="border-b p-4">Available Stock</th>
                <th className="border-b p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.book_id}>
                    <td className="border-b p-4 flex items-center gap-4">
                      <img
                        src={book.image_url || "https://via.placeholder.com/50"}
                        alt={book.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <span>{book.title}</span>
                    </td>
                    <td className="border-b p-4">{book.book_id}</td>
                    {book.available_quantity === 0 ? (
                      <td className="border-b p-4 text-red-500">Out of Stock</td>
                    ) : (
                      <td className="border-b p-4">{book.available_quantity}</td>
                    )}
                    <td className="border-b p-4">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          setSelectedBook(book);
                          setNewStock(book.available_quantity);
                        }}
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="p-2">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="p-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Update Stock Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Update Stock</h3>
            <p className="mb-2">
              <strong>Book:</strong> {selectedBook.title}
            </p>
            <p className="mb-4">
              <strong>Current Stock:</strong> {selectedBook.available_quantity}
            </p>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllBooks } from "../services/api";
import BookCard from "../components/common/BookCard";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = parseInt(searchParams.get("pageSize")) || 10;
  const pageNum = parseInt(searchParams.get("pageNum")) || 1;

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getAllBooks(pageSize, (pageNum - 1) * pageSize);
      setBooks(booksData);
    };

    fetchBooks();
  }, [pageSize, pageNum]);

  const handlePageChange = (newPageNum) => {
    setSearchParams({ pageSize, pageNum: newPageNum });
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#65aa92]">
        Books
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.book_id} book={book} />
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
          disabled={books.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBooksPage;

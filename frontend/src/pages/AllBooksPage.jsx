import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/api";
import BookCard from "../components/common/BookCard"; 

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getAllBooks();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {books.map((book) => (
          <BookCard key={book.book_id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default AllBooksPage;
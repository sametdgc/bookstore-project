import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBooksByGenre, getGenreIdByName } from "../services/api";
import BookCard from "../components/common/BookCard";

const   GenrePage = () => {
  const { genreName } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksByGenre = async () => {
      const genreId = await getGenreIdByName(genreName);
      const booksData = await getBooksByGenre(genreId);
      setBooks(booksData);
      setLoading(false);
    };

    fetchBooksByGenre();
  }, [genreName]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center capitalize">
        {genreName}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
          key={book.book_id}
          book={book}
          onAddToCart={() => handleAddToCart(book)}
        />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;

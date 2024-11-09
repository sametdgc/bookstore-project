import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch book data from Supabase
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks(data);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={book.image_url} // Ensure `image_url` contains valid URLs for book images
              alt={book.title}
              className="w-full h-64 object-cover mb-4 rounded-md"
            />
            <h2 className="text-lg font-semibold text-center">{book.title}</h2>
            <p className="text-gray-700 text-center">${book.price}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AddBookPage = () => {
  const navigate = useNavigate();

  // State for book fields
  const [bookData, setBookData] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
    available_quantity: "",
    author_id: "",
    isbn: "",
    language_id: "",
    genre_id: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  // Add book to the database
  const handleAddBook = async () => {
    // Validate required fields
    if (!bookData.title || !bookData.description || !bookData.price) {
      alert("Please fill in all required fields: Title, Description, Price.");
      return;
    }

    const { error } = await supabase.from("books").insert([
      {
        title: bookData.title,
        description: bookData.description,
        price: parseFloat(bookData.price),
        image_url: bookData.image_url || null,
        available_quantity: bookData.available_quantity
          ? parseInt(bookData.available_quantity)
          : null,
        author_id: bookData.author_id || null,
        isbn: bookData.isbn || null,
        language_id: bookData.language_id || null,
        genre_id: bookData.genre_id || null,
      },
    ]);

    if (error) {
      console.error("Error adding book:", error.message);
      alert("Failed to add the book. Please try again.");
    } else {
      alert("Book added successfully!");
      navigate("/pm/manage-products"); // Navigate back to the Product Management page
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>

      {/* Input Form */}
      <div className="space-y-4">
        {/* Required Fields */}
        <input
          name="title"
          placeholder="Title *"
          value={bookData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description *"
          value={bookData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="price"
          placeholder="Price *"
          type="number"
          value={bookData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Optional Fields */}
        <input
          name="image_url"
          placeholder="Image URL (Optional)"
          value={bookData.image_url}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="available_quantity"
          placeholder="Stock Quantity (Optional)"
          type="number"
          value={bookData.available_quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="author_id"
          placeholder="Author ID (Optional)"
          value={bookData.author_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="isbn"
          placeholder="ISBN (Optional)"
          value={bookData.isbn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="language_id"
          placeholder="Language ID (Optional)"
          value={bookData.language_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="genre_id"
          placeholder="Genre ID (Optional)"
          value={bookData.genre_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={() => navigate("/pm/manage-products")}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleAddBook}
          className="bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e]"
        >
          Add Book
        </button>
      </div>
    </div>
  );
};

export default AddBookPage;

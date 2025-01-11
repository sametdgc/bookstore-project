import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const AddBookPage = () => {
  const navigate = useNavigate();

  // State for book fields
  const [bookData, setBookData] = useState({
    book_id: "", // Automatically determined
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

  // Fetch the largest book_id from the database and increment it
  useEffect(() => {
    const fetchMaxBookId = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("book_id")
        .order("book_id", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching max book_id:", error.message);
      } else if (data && data.length > 0) {
        setBookData((prev) => ({
          ...prev,
          book_id: parseInt(data[0].book_id, 10) + 1, // Increment the largest ID by 1
        }));
      } else {
        setBookData((prev) => ({ ...prev, book_id: 1 })); // Default to 1 if no books exist
      }
    };

    fetchMaxBookId();
  }, []);

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

    // Prepare the data for insertion
    const dataToInsert = {
      book_id: bookData.book_id, // Automatically assigned
      title: bookData.title,
      description: bookData.description,
      price: parseFloat(bookData.price), // Ensure price is a float
      image_url: bookData.image_url || null, // Allow null for optional fields
      available_quantity: bookData.available_quantity
        ? parseInt(bookData.available_quantity)
        : null, // Convert to integer or null
      author_id: bookData.author_id ? parseInt(bookData.author_id) : null, // Convert to integer or null
      isbn: bookData.isbn || null, // Allow null for optional fields
      language_id: bookData.language_id
        ? parseInt(bookData.language_id)
        : null, // Convert to integer or null
      genre_id: bookData.genre_id ? parseInt(bookData.genre_id) : null, // Convert to integer or null
    };

    console.log("Data to insert:", dataToInsert); // Debugging log

    // Insert the book into the database
    const { error } = await supabase.from("books").insert([dataToInsert]);

    if (error) {
      console.error("Error adding book:", error.message);
      alert(`Failed to add the book: ${error.message}`);
    } else {
      alert("Book added successfully!");
      navigate("/pm-dashboard"); // Navigate back to Product Management page
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>

      {/* Input Form */}
      <div className="space-y-4">
        {/* Display the auto-assigned Book ID */}
        <input
          name="book_id"
          placeholder="Book ID *"
          value={bookData.book_id}
          readOnly
          className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />

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
          type="number"
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
          type="number"
          value={bookData.language_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="genre_id"
          placeholder="Genre ID (Optional)"
          type="number"
          value={bookData.genre_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 space-x-2">
        <Link
          to="/pm-dashboard"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </Link>
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

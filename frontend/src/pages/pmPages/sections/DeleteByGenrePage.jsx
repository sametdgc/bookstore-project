import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const DeleteByGenrePage = () => {
  const [genres, setGenres] = useState([]); // Store genres
  const [selectedGenre, setSelectedGenre] = useState(""); // Selected genre ID
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(""); // Success/error message

  // Fetch genres from the database
  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("*");
      if (error) {
        console.error("Error fetching genres:", error.message);
        setMessage("Failed to fetch genres.");
      } else {
        setGenres(data);
      }
    };

    fetchGenres();
  }, []);

  // Handle delete books by genre and delete the genre itself
  const handleDeleteByGenre = async () => {
    if (!selectedGenre) {
      setMessage("Please select a genre.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all books in this genre and the genre itself? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setLoading(true);
    setMessage("");

    // Delete books in the selected genre
    const { error: bookError } = await supabase
      .from("books")
      .delete()
      .eq("genre_id", selectedGenre);

    if (bookError) {
      console.error("Error deleting books:", bookError.message);
      setLoading(false);
      setMessage(`Failed to delete books: ${bookError.message}`);
      return;
    }

    // Delete the genre itself
    const { error: genreError } = await supabase
      .from("genres")
      .delete()
      .eq("genre_id", selectedGenre);

    setLoading(false);

    if (genreError) {
      console.error("Error deleting genre:", genreError.message);
      setMessage(`Books were deleted, but failed to delete the genre: ${genreError.message}`);
    } else {
      setMessage("Books and the selected genre have been successfully deleted.");
      // Refresh genres list
      setGenres((prevGenres) => prevGenres.filter((g) => g.genre_id !== selectedGenre));
      setSelectedGenre(""); // Reset selected genre
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Delete Books by Genre</h2>

      {/* Dropdown to select a genre */}
      <div className="mb-4">
        <label htmlFor="genre" className="block text-gray-700 font-semibold mb-2">
          Select Genre
        </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select a Genre --</option>
          {genres.map((genre) => (
            <option key={genre.genre_id} value={genre.genre_id}>
              {genre.genre_name}
            </option>
          ))}
        </select>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteByGenre}
        disabled={loading}
        className={`w-full px-4 py-2 text-white rounded ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {loading ? "Deleting..." : "Delete Books and Genre"}
      </button>

      {/* Message Section */}
      {message && (
        <div
          className={`mt-4 p-4 rounded ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default DeleteByGenrePage;

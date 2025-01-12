import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const AddGenrePage = () => {
  const navigate = useNavigate();

  // State for genre fields
  const [genreData, setGenreData] = useState({
    genre_id: "", // Automatically determined
    genre_name: "",
  });

  // Fetch the largest genre_id from the database and increment it
  useEffect(() => {
    const fetchMaxGenreId = async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("genre_id")
        .order("genre_id", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching max genre_id:", error.message);
      } else if (data && data.length > 0) {
        setGenreData((prev) => ({
          ...prev,
          genre_id: parseInt(data[0].genre_id, 10) + 1, // Increment the largest ID by 1
        }));
      } else {
        setGenreData((prev) => ({ ...prev, genre_id: 1 })); // Default to 1 if no genres exist
      }
    };

    fetchMaxGenreId();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGenreData((prev) => ({ ...prev, [name]: value }));
  };

  // Add genre to the database
  const handleAddGenre = async () => {
    // Validate required fields
    if (!genreData.genre_id || !genreData.genre_name) {
      alert("Please fill in both fields: Genre ID and Genre Name.");
      return;
    }

    // Prepare the data for insertion
    const dataToInsert = {
      genre_id: parseInt(genreData.genre_id), // Ensure ID is an integer
      genre_name: genreData.genre_name.trim(), // Trim whitespace
    };

    console.log("Data to insert:", dataToInsert); // Debugging log

    // Insert the genre into the database
    const { error } = await supabase.from("genres").insert([dataToInsert]);

    if (error) {
      console.error("Error adding genre:", error.message);
      alert(`Failed to add the genre: ${error.message}`);
    } else {
      alert("Genre added successfully!");
      navigate("/pm-dashboard"); // Navigate back to Product Management page
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Genre</h2>

      {/* Input Form */}
      <div className="space-y-4">
        {/* Display the auto-assigned Genre ID */}
        <input
          name="genre_id"
          placeholder="Genre ID *"
          value={genreData.genre_id}
          readOnly
          className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <input
          name="genre_name"
          placeholder="Genre Name *"
          value={genreData.genre_name}
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
          onClick={handleAddGenre}
          className="bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e]"
        >
          Add Genre
        </button>
      </div>
    </div>
  );
};

export default AddGenrePage;

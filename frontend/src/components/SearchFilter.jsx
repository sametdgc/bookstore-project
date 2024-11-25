import React, { useState, useEffect } from "react";
import { getGenres } from "../services/api";

const SearchFilter = ({ onFilterChange, onCollapseChange }) => {
  const [genres, setGenres] = useState([]); // Stores fetched genres
  const [selectedGenres, setSelectedGenres] = useState([]); // Stores selected genre IDs
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isCollapsed, setIsCollapsed] = useState(false); // Internal toggle for collapse

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Handle checkbox toggle
  const handleCheckboxChange = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId) // Remove if already selected
        : [...prev, genreId] // Add if not selected
    );
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange({ genre_ids: selectedGenres, minPrice, maxPrice });
  };

  // Toggle collapse
  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState); // Notify parent
  };

  return (
    <div
      className={`relative bg-gray-100 rounded-lg shadow-md transition-all duration-300 ${
        isCollapsed ? "w-12 p-1 flex justify-center items-center" : "p-4"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-2 right-2 cursor-pointer bg-[#65aa92] text-white p-2 rounded-lg hover:bg-[#4c8a73] transition-colors duration-300"
      >
        {isCollapsed ? "➤" : "☰"}
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div>
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div className="flex flex-col gap-4">
            {/* Genre Dropdown with Checkboxes */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Genres</h3>
              <div className="border rounded-lg shadow-sm bg-white p-2 max-h-40 overflow-y-auto">
                {genres.map((genre) => (
                  <div key={genre.genre_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`genre-${genre.genre_id}`}
                      value={genre.genre_id}
                      onChange={() => handleCheckboxChange(genre.genre_id)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`genre-${genre.genre_id}`}
                      className="cursor-pointer text-sm truncate w-full"
                    >
                      {genre.genre_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Price:</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-20 p-2 border rounded-lg"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 p-2 border rounded-lg"
              />
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={handleApplyFilters}
              className="p-2 bg-[#65aa92] text-white rounded-lg hover:bg-[#4c8a73] transition-colors duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

import React, { useState, useEffect } from "react";
import { getGenres, getLanguages } from "../services/api";

const SearchFilter = ({
  onFilterChange,
  onSortChange,
  onCollapseChange,
  genreCounts,
  languageCounts,
  authorCounts,
  authors, // All authors passed from SearchPage
}) => {
  const [genres, setGenres] = useState([]); // Stores fetched genres
  const [languages, setLanguages] = useState([]); // Stores fetched languages
  const [selectedGenres, setSelectedGenres] = useState([]); // Selected genre IDs
  const [selectedLanguages, setSelectedLanguages] = useState([]); // Selected language IDs
  const [selectedAuthors, setSelectedAuthors] = useState([]); // Selected author IDs
  const [authorSearch, setAuthorSearch] = useState(""); // Search input for authors
  const [filteredAuthors, setFilteredAuthors] = useState([]); // Authors displayed based on search
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isCollapsed, setIsCollapsed] = useState(false); // Internal toggle for collapse
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order

  // Fetch genres and languages on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [fetchedGenres, fetchedLanguages] = await Promise.all([
          getGenres(),
          getLanguages(),
        ]);
        setGenres(fetchedGenres);
        setLanguages(fetchedLanguages);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // Update filtered authors whenever the search input changes
  useEffect(() => {
    if (authorSearch.trim() === "") {
      setFilteredAuthors(authors); // Show all authors if no search input
    } else {
      setFilteredAuthors(
        authors.filter((author) =>
          author.author_name.toLowerCase().includes(authorSearch.toLowerCase())
        )
      );
    }
  }, [authorSearch, authors]);

  // Handle genre checkbox toggle
  const handleGenreCheckboxChange = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId) // Remove if already selected
        : [...prev, genreId] // Add if not selected
    );
  };

  // Handle language checkbox toggle
  const handleLanguageCheckboxChange = (languageId) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId) // Remove if already selected
        : [...prev, languageId] // Add if not selected
    );
  };

  // Handle author checkbox toggle
  const handleAuthorCheckboxChange = (authorId) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId) // Remove if already selected
        : [...prev, authorId] // Add if not selected
    );
  };

  // Handle sort order change
  const handleSortOrderChange = (e) => {
    const selectedOrder = e.target.value;
    setSortOrder(selectedOrder);
    onSortChange(selectedOrder); // Notify parent of sort change
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange({
      genre_ids: selectedGenres,
      language_ids: selectedLanguages,
      author_ids: selectedAuthors,
      minPrice,
      maxPrice,
    });
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
            {/* Sort By Dropdown */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Sort By</h3>
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

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
                      onChange={() => handleGenreCheckboxChange(genre.genre_id)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`genre-${genre.genre_id}`}
                      className="cursor-pointer text-sm truncate w-full"
                    >
                      {genre.genre_name}{" "}
                      <span className="text-gray-500">
                        ({genreCounts[genre.genre_id] || 0})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Dropdown with Checkboxes */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <div className="border rounded-lg shadow-sm bg-white p-2 max-h-40 overflow-y-auto">
                {languages.map((language) => (
                  <div key={language.language_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`language-${language.language_id}`}
                      value={language.language_id}
                      onChange={() =>
                        handleLanguageCheckboxChange(language.language_id)
                      }
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`language-${language.language_id}`}
                      className="cursor-pointer text-sm truncate w-full"
                    >
                      {language.language_name}{" "}
                      <span className="text-gray-500">
                        ({languageCounts[language.language_id] || 0})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Dropdown with Checkboxes and Search */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Authors</h3>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search authors..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full p-2 mb-2 border rounded-lg"
              />
              {/* Author List */}
              <div className="border rounded-lg shadow-sm bg-white p-2 max-h-40 overflow-y-auto">
                {filteredAuthors.map((author) => (
                  <div key={author.author_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`author-${author.author_id}`}
                      value={author.author_id}
                      onChange={() =>
                        handleAuthorCheckboxChange(author.author_id)
                      }
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`author-${author.author_id}`}
                      className="cursor-pointer text-sm truncate w-full"
                    >
                      {author.author_name}{" "}
                      <span className="text-gray-500">
                        ({authorCounts[author.author_id] || 0})
                      </span>
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

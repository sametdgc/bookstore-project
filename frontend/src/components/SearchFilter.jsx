import React, { useState, useEffect } from "react";
import { getGenres, getLanguages } from "../services/api";

const SearchFilter = ({
  onFilterChange,
  onSortChange,
  onCollapseChange,
  genreCounts,
  languageCounts,
  authorCounts,
  authors,
  initialFilters, // Initial filters passed from parent
}) => {
  const [genres, setGenres] = useState([]); // Stores fetched genres
  const [languages, setLanguages] = useState([]); // Stores fetched languages
  const [selectedGenres, setSelectedGenres] = useState(initialFilters.genre_ids.map(Number) || []);
  const [selectedLanguages, setSelectedLanguages] = useState(initialFilters.language_ids.map(Number) || []);
  const [selectedAuthors, setSelectedAuthors] = useState(initialFilters.author_ids.map(Number) || []);
  const [authorSearch, setAuthorSearch] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState(authors || []);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || 100);
  const [isCollapsed, setIsCollapsed] = useState(false); // Internal toggle for collapse
  const [sortOption, setSortOption] = useState("price-asc"); // Unified sort state


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
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  // Handle language checkbox toggle
  const handleLanguageCheckboxChange = (languageId) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId]
    );
  };

  // Handle author checkbox toggle
  const handleAuthorCheckboxChange = (authorId) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId]
    );
  };

  const handleSortChange = (e) => {
    const selectedSortOption = e.target.value;
    setSortOption(selectedSortOption);
    onSortChange(selectedSortOption); // Notify parent of sort change
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
    onCollapseChange(newCollapsedState);
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
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-bold mb-4">Custom Search</h1>
  
          {/* Sorting Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
            <h2 className="text-lg font-semibold mb-2">Sort By</h2>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity-high">Popularity: Most Popular</option>
              <option value="popularity-low">Popularity: Least Popular</option>
            </select>
          </div>
  
          {/* Advanced Filters Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
            <h2 className="text-lg font-semibold mb-2">Advanced Filters</h2>
  
            {/* Genres */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Genres</h3>
              <div className="border rounded-lg shadow-sm bg-white p-2 max-h-40 overflow-y-auto">
                {genres.map((genre) => (
                  <div key={genre.genre_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.genre_id)}
                      onChange={() => handleGenreCheckboxChange(genre.genre_id)}
                      className="cursor-pointer"
                    />
                    <label className="cursor-pointer text-sm truncate w-full">
                      {genre.genre_name}{" "}
                      <span className="text-gray-500">
                        ({genreCounts[genre.genre_id] || 0})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Languages */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <div className="border rounded-lg shadow-sm bg-white p-2 max-h-40 overflow-y-auto">
                {languages.map((language) => (
                  <div key={language.language_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language.language_id)}
                      onChange={() =>
                        handleLanguageCheckboxChange(language.language_id)
                      }
                      className="cursor-pointer"
                    />
                    <label className="cursor-pointer text-sm truncate w-full">
                      {language.language_name}{" "}
                      <span className="text-gray-500">
                        ({languageCounts[language.language_id] || 0})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Authors */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Authors</h3>
              <input
                type="text"
                placeholder="Search authors..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <div className="border rounded-lg shadow-sm bg-white p-2 max-h-40 overflow-y-auto">
                {filteredAuthors.map((author) => (
                  <div key={author.author_id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAuthors.includes(author.author_id)}
                      onChange={() =>
                        handleAuthorCheckboxChange(author.author_id)
                      }
                      className="cursor-pointer"
                    />
                    <label className="cursor-pointer text-sm truncate w-full">
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
            <div className="flex items-center gap-2 mt-4">
                <span>Price:</span>
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
              className="mt-4 p-2 bg-[#65aa92] text-white rounded-lg hover:bg-[#4c8a73]"
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

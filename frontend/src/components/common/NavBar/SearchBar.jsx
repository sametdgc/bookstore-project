import React from "react";

const SearchBar = () => {
  return (
    <div className="hidden md:flex flex-grow mx-4">
      <input
        type="text"
        placeholder="Search for books, categories, authors..."
        className="w-full px-4 py-2 rounded-md text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
      />
    </div>
  );
};

export default SearchBar;
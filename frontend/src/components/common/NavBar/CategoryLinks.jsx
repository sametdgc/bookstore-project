import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../../../services/api";

const CategoryLinks = () => {
    const [categories, setCategories] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getGenres();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const handleCategoryClick = () => {
        setDropdownVisible(false);
    };

    return (
        <div className="relative">
            {/* Navigation Links */}
            <div className="flex justify-center items-center space-x-4">
                <Link
                    to="/search?sortOrder=popularity-high"
                    className="hover:text-gray-600 text-gray-800 px-2 py-1 whitespace-nowrap transition-all"
                >
                    All Books
                </Link>
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className="hover:text-gray-600 text-gray-800 px-2 py-1 whitespace-nowrap transition-all"
                >
                    Categories
                </button>
            </div>

            {/* Dropdown */}
            {dropdownVisible && (
                <div
                    ref={dropdownRef}
                    className="absolute bg-white shadow-lg rounded-lg mt-2 grid grid-cols-3 gap-4 p-4 z-50 w-[300px] sm:w-[400px] border border-gray-200"
                    style={{
                        top: "calc(100% + 8px)", // Space below the button
                        left: "50%", // Aligns to the center of the button
                        transform: "translateX(-50%)", // Adjust for proper centering
                    }}
                >
                    {categories.map((category) => (
                        <Link
                            key={category.genre_id}
                            to={`/search?genre_ids=${category.genre_id}&sortOrder=popularity-high`}
                            className="text-[#30785f] hover:bg-gray-100 rounded-md px-2 py-1 block transition-all text-sm"
                            onClick={handleCategoryClick}
                        >
                            {category.genre_name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryLinks;



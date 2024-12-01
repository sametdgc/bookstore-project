import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../../../services/api";

const CategoryLinks = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getGenres();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex flex-wrap justify-center space-x-2 md:space-x-4 py-2 text-white text-sm md:text-base bg-[#65aa92]">
            {/* Add the All Books link */}
            <Link to="/search?sortOrder=popularity-high" className="hover:text-gray-300 px-2 py-1 whitespace-nowrap">
                All Books
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.genre_id}
                    to={`/search?genre_ids=${category.genre_id}&sortOrder=popularity-high`}
                    className="hover:text-gray-300 px-2 py-1 whitespace-nowrap"
                >
                    {category.genre_name}
                </Link>
            ))}
        </div>
    );
};

export default CategoryLinks;

import React, { useState, useEffect, useRef } from "react";
import { getBestSellingBooks, getNewBooks, getBookDetailsById } from "../../services/api";
import BookCard from "../common/BookCard";

const MainContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [newReleases, setNewReleases] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [staffPicks, setStaffPicks] = useState([]);
  const [maxCardHeight, setMaxCardHeight] = useState(0);

  const cardsContainerRef = useRef(null);


  useEffect(() => {
    setIsVisible(true);

    const fetchBooks = async () => {
      try {
        const [newBooks, bestSellers, staffPicksData] = await Promise.all([
          getNewBooks(),
          getBestSellingBooks(),
          Promise.all([
            getBookDetailsById(6),
            getBookDetailsById(7),
            getBookDetailsById(8),
            getBookDetailsById(9),
          ]),
        ]);

        setNewReleases(newBooks);
        setBestsellers(bestSellers);
        setStaffPicks(staffPicksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

useEffect(() => {
    if (cardsContainerRef.current) {
      const cardElements = cardsContainerRef.current.querySelectorAll(".book-card");
      const heights = Array.from(cardElements).map((el) => el.offsetHeight);
      setMaxCardHeight(Math.max(...heights));
    }
  }, [newReleases, bestsellers, staffPicks]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d7e3ec] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/book-texture.png')] opacity-5 mix-blend-overlay bg-cover bg-center"></div>
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div
          className={`text-center transition-all duration-1000 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2c5282] to-[#65aa92] mb-6 leading-tight">
            Welcome to
            <span className="block mt-2 text-7xl md:text-8xl">Chapter 0</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mt-6 max-w-3xl mx-auto leading-relaxed font-light">
            Embark on countless literary adventures. Discover our carefully
            curated collection, from timeless classics to contemporary
            masterpieces.
          </p>
        </div>

        {/* Book Categories */}
        <div className="mt-16 space-y-12 w-full max-w-6xl">
          {[
            { category: "New Releases", books: newReleases },
            { category: "Bestsellers", books: bestsellers },
            { category: "Staff Picks", books: staffPicks },
          ].map(({ category, books }, index) => (
            <div
              key={category}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${(index + 2) * 150}ms` }}
            >
              {/* Category Header */}
              <h2 className="text-3xl font-bold text-[#2c5282] mb-2">{category}</h2>
              {/* Category Description */}
              <p className="text-gray-600 mb-6">
                Discover our latest {category.toLowerCase()}.
              </p>
              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
                {console.log(books)}
                {books.length > 0 ? (
                  books.map((book) => (
                    <BookCard
                      key={book.book_id}
                      book={book}
                      className="hover:shadow-lg transition-all duration-300"
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No books available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;

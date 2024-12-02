import React, { useState, useEffect, useRef } from "react";
import { HeroSection, MainContent } from "../../components";
import {
  BookOpen,
  Users,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "../../components/common/BookCard";
import { getTopRatedBooks } from "../../services/api"; // Import the API function


const MainPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <HeroSection />
      <MainContent />
      <TopRatedBooks />
      <FeaturesSection />
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose <span className="text-[#65aa92]">Chapter 0</span>{" "}
          Bookstore?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-[#65aa92]" />}
            title="Extensive Collection"
            description="Discover a vast array of books across all genres and topics."
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-[#65aa92]" />}
            title="Community Events"
            description="Join our book clubs and author meet-and-greets."
          />
          <FeatureCard
            icon={<ShoppingBag className="w-12 h-12 text-[#65aa92]" />}
            title="Easy Shopping"
            description="Enjoy a seamless online shopping experience with quick delivery."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-[#65aa92] rounded-full p-4 mb-4">
        {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
      </div>
      <h3 className="mt-2 mb-3 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};


const TopRatedBooks = () => {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const booksPerPage = 4;
  const containerRef = useRef(null); // Ref for the container to calculate height

  // Fetch top-rated books
  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        const topRatedBooks = await getTopRatedBooks();
        setBooks(topRatedBooks);
      } catch (error) {
        console.error("Error fetching top-rated books:", error);
      }
    };

    fetchTopRatedBooks();
  }, []);

  // Ensure the container has a consistent height
  useEffect(() => {
    if (containerRef.current) {
      const cardHeights = Array.from(containerRef.current.children).map(
        (child) => child.getBoundingClientRect().height
      );
      const maxHeight = Math.max(...cardHeights);
      containerRef.current.style.height = `${maxHeight}px`;
    }
  }, [books]);

  const nextBooks = () => {
    if (startIndex + booksPerPage < books.length) {
      setDirection(1);
      setStartIndex((prevIndex) => prevIndex + booksPerPage);
    }
  };

  const prevBooks = () => {
    if (startIndex > 0) {
      setDirection(-1);
      setStartIndex((prevIndex) => prevIndex - booksPerPage);
    }
  };

  const visibleBooks = books.slice(startIndex, startIndex + booksPerPage);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0,
    }),
  };

  return (
    <section
      id="top-rated-books"
      className="py-16 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Top Rated <span className="text-[#65aa92]">Books</span>
        </h2>
        <div className="relative h-[500px]"> {/* Ensure consistent height */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`slide-${startIndex}`} // Unique key for each slide
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              ref={containerRef} // Attach the ref for height calculation
              className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {visibleBooks.length > 0 ? (
                visibleBooks.map((book) => (
                  <BookCard key={book.book_id} book={book} />
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No top-rated books available.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Buttons */}
        <button
          onClick={prevBooks}
          disabled={startIndex === 0}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 transition-all duration-300 ${
            startIndex === 0
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-[#65aa92] hover:text-white"
          }`}
          aria-label="Previous books"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextBooks}
          disabled={startIndex + booksPerPage >= books.length}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 transition-all duration-300 ${
            startIndex + booksPerPage >= books.length
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-[#65aa92] hover:text-white"
          }`}
          aria-label="Next books"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/search"
            className="inline-flex items-center text-[#65aa92] hover:text-[#4a7d6b] transition-colors duration-300"
          >
            <span className="mr-2">View all books</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};


export default MainPage;

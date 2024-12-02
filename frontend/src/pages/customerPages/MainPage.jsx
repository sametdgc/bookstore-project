import React, { useState, useEffect } from "react";
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
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      rating: 4.5,
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      rating: 4.8,
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      rating: 4.6,
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      rating: 4.7,
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      rating: 4.3,
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 6,
      title: "One Hundred Years of Solitude",
      author: "Gabriel García Márquez",
      rating: 4.7,
      cover: "/placeholder.svg?height=300&width=200",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const booksPerPage = 4;

  const nextBooks = () => {
    setDirection(1);
    setStartIndex((prevIndex) => (prevIndex + booksPerPage) % books.length);
  };

  const prevBooks = () => {
    setDirection(-1);
    setStartIndex(
      (prevIndex) => (prevIndex - booksPerPage + books.length) % books.length
    );
  };

  const visibleBooks = [
    ...books.slice(startIndex),
    ...books.slice(0, startIndex),
  ].slice(0, booksPerPage);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/book-pattern.png')] opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Top Rated <span className="text-[#65aa92]">Books</span>
        </h2>
        <div className="relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={startIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {visibleBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevBooks}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 transition-all duration-300 hover:bg-[#65aa92] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#65aa92] focus:ring-opacity-50"
            aria-label="Previous books"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextBooks}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md z-10 transition-all duration-300 hover:bg-[#65aa92] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#65aa92] focus:ring-opacity-50"
            aria-label="Next books"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="text-center mt-12">
          <a
            href="/books"
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

const BookCard = ({ book }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-[#65aa92] hover:text-white transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-2 line-clamp-1">{book.author}</p>
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="text-gray-700">{book.rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.div>
  );
};

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export default MainPage;

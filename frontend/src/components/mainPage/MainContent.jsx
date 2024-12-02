import React, { useState, useEffect } from "react";

const MainContent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d7e3ec] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/book-texture.png')] opacity-5 mix-blend-overlay bg-cover bg-center"></div>
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
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

        <div
          className={`mt-12 transition-all duration-1000 delay-300 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <button className="bg-gradient-to-r from-[#2c5282] to-[#65aa92] text-white text-lg font-semibold py-4 px-10 rounded-full hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out transform">
            Explore Our Collection
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {["New Releases", "Bestsellers", "Staff Picks"].map(
            (category, index) => (
              <div
                key={category}
                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${(index + 2) * 150}ms` }}
              >
                <h2 className="text-2xl font-bold text-[#2c5282] mb-2">
                  {category}
                </h2>
                <p className="text-gray-600">
                  Discover our latest {category.toLowerCase()}.
                </p>
              </div>
            )
          )}
        </div>

        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#65aa92] animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#65aa92] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-[#2c5282] rounded-full opacity-20 blur-3xl"></div>
    </div>
  );
};

export default MainContent;

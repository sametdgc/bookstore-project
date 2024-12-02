import React from "react";
import { HeroSection, MainContent } from "../../components";
import { BookOpen, Users, ShoppingBag } from "lucide-react";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <MainContent />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Chapter 0 Bookstore?
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
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
      {icon}
      <h3 className="mt-4 mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default MainPage;

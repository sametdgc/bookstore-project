import React from 'react';
import { HeroSection, SubscriptionBanner, Footer } from '../components';


const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-semibold text-[#65aa92]">Welcome to Chapter 0 Bookstore</h1>
        <p className="text-lg text-gray-600 mt-4">
          Discover a world of books and more. Browse our categories, find new releases, and enjoy reading!
        </p>
      </div>

      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainPage;

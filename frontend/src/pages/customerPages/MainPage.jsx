import React from 'react';
import { HeroSection, MainContent } from '../../components';


const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <MainContent/>

    </div>
  );
};

export default MainPage;

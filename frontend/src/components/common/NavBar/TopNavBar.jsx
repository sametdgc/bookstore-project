import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { chapter0Logo } from '../../../assets';
import CategoryLinks from './CategoryLinks';
import LoginStatus from './LoginStatus';
import SearchBar from "./SearchBar";

const TopNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#65aa92] text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        
        {/* Logo with Link to Home */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={chapter0Logo} alt="Chapter 0 Logo" className="h-12 w-auto" />
          </Link>
        </div>

        {/* Search Bar */}
        <SearchBar/>

        {/* Icons and Hamburger Menu */}
        <div className="flex items-center space-x-4">
          <LoginStatus />
          <Link to="/wishlist" className="text-white hover:text-[#f5f5f5]">
            <HeartIcon className="w-6 h-6" />
          </Link>
          <Link to="/cart" className="text-white hover:text-[#f5f5f5]">
            <ShoppingCartIcon className="w-6 h-6" />
          </Link>

          {/* Hamburger Icon for Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dropdown for Category Links and Search */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#65aa92]">
          {/* Search Bar for Mobile */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search for books, categories, authors..."
              className="w-full px-4 py-2 rounded-md text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
            />
          </div>
          
          {/* Category Links */}
          <CategoryLinks />
        </div>
      )}

      {/* Category Links Row for Desktop */}
      <div className="hidden md:block">
        <CategoryLinks />
      </div>
    </nav>
  );
};

export default TopNavBar;

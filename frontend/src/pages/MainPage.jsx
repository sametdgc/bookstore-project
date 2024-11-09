import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import chapter0Logo from '../assets/chapter0Logo.png';
import { supabase } from '../supabaseClient';

const MainPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
    });

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-[#65aa92] text-white py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4">
          
          {/* Logo and Site Name */}
          <div className="flex items-center space-x-2">
            <img 
              src={chapter0Logo}  
              alt="Chapter 0 Logo"
              className="h-20 w-50"
            />
          </div>

          {/* Search Bar */}
          <div className="flex-grow mx-4">
            <input 
              type="text" 
              placeholder="Search for books, categories, authors..." 
              className="w-full px-4 py-2 rounded-md text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
            />
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white">Hello, {user.email}</span>
                <button 
                  onClick={handleSignOut} 
                  className="text-white hover:text-[#f5f5f5]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            )}

            {/* Wishlist and Shopping Cart Icons */}
            <Link to="/wishlist" className="text-white hover:text-[#f5f5f5]">
              <HeartIcon className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="text-white hover:text-[#f5f5f5]">
              <ShoppingCartIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-semibold text-[#65aa92]">Welcome to Chapter 0 Bookstore</h1>
        <p className="text-lg text-gray-600 mt-4">
          Discover a world of books and more. Browse our categories, find new releases, and enjoy reading!
        </p>
      </div>
    </div>
  );
};

export default MainPage;

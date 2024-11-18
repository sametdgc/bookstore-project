import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { getUserData } from "../../../services/api";  // Import the getUserData function

const LoginStatus = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');  // State to store user name
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // If user is logged in, fetch their data
        fetchUserData();
      }
    });

    // If user is already logged in, fetch their data when component mounts
    const fetchUserData = async () => {
      if (user) {
        const userData = await getUserData(); // Fetch user data using the function
        if (userData) {
          setUserName(userData.full_name); // Assuming your users table has a field
        }
      }
    };

    fetchUserData();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user]); // Run the effect again when user changes

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
    setUser(null);
    setUserName(''); // Clear the user name
    navigate('/login');
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <span className="text-white">Hello, {userName}</span> {/* Display the user's name */}
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
    </div>
  );
};

export default LoginStatus;

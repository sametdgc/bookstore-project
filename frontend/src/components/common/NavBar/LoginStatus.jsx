import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { getUserData } from "../../../services/api";
import Cookies from "js-cookie";

const LoginStatus = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUserName(userData.full_name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedInUser = session?.user || null;
      setUser(loggedInUser);

      if (loggedInUser) {
        fetchUserData();
      } else {
        setUserName('');
      }
    });

    // Check for a logged-in user when the component mounts
    const session = supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchUserData();
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null);
      setUserName('');
      Cookies.remove("user_id");
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Link to="/profile" className="text-white hover:underline">
            Hello, {userName}
          </Link>

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

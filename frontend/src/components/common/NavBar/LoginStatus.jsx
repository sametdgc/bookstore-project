import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';

const LoginStatus = () => {
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
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <span className="text-white">Hello, {user.identities[0].identity_data.fullName}</span>
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

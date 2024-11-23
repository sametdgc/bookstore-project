import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import {testSupabaseConnection, syncLocalCartToDatabase, getLocalCartItems} from '../services/api';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      testSupabaseConnection();
  
      // Step 1: Authenticate the user
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error("Login error details:", error);
        setError('Wrong email or password, please try again.');
        return;
      }
  
      console.log('User signed in:', user);
  
      // Step 2: Fetch the user's ID from user metadata
      const userId = user.user_metadata.custom_incremented_id;
  
      // Step 3: Get the local cart items
      const localCart = getLocalCartItems();
  
      // Step 4: Sync the local cart to the database
      await syncLocalCartToDatabase(localCart, userId);
  
      // Step 5: Navigate to the homepage or shopping cart
      navigate('/shopping-cart'); // Redirect to shopping cart after syncing
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };
  

  return (
    <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-[#65aa92] text-white font-semibold rounded-md shadow hover:bg-[#4e8a70] focus:outline-none focus:ring-2 focus:ring-[#65aa92] focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Don’t have an account? <Link to="/register"  className="text-[#65aa92] hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default LoginForm;

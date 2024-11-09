import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import {testSupabaseConnection} from '../services/api';


const RegisterForm = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [error, setError] = useState('');  // Added state for error
  const [success, setSuccess] = useState(false);  // Added state for success

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    const fullName = `${name} ${surname}`;
    
    try {
      // Register user with Supabase
      console.log('Registering user:', email, password, fullName, taxId, phone, role); // Corrected: Log the input values
      testSupabaseConnection();
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,  // Combine name and surname into fullName
            taxId,
            phone,
            role,  
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        console.log('User registered:', user); // Corrected: Log the 'user' directly
        // Redirect or handle post-registration actions as needed
        setName('');setSurname('');setEmail('');setTaxId('');setPhone('');setPassword('');setConfirmPassword('');
        
        //maybe direct user to the login page
        navigate('/login');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An unexpected error occurred. Please try again.');
    }
      
  };

  return (
    <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
          <input 
            type="text" 
            id="surname" 
            value={surname} 
            onChange={(e) => setSurname(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input 
            type="text" 
            id="taxId" 
            value={taxId} 
            onChange={(e) => setTaxId(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
    

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Role selection */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <div className="flex space-x-6 mt-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="customer" 
                name="role" 
                value="customer" 
                checked={role === 'customer'} 
                onChange={handleRoleChange} 
                className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded-full"
              />
              <label htmlFor="customer" className="ml-2 text-gray-700">Customer</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="salesManager" 
                name="role" 
                value="salesManager" 
                checked={role === 'salesManager'} 
                onChange={handleRoleChange} 
                className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded-full"
              />
              <label htmlFor="salesManager" className="ml-2 text-gray-700">Sales Manager</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="productManager" 
                name="role" 
                value="productManager" 
                checked={role === 'productManager'} 
                onChange={handleRoleChange} 
                className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded-full"
              />
              <label htmlFor="productManager" className="ml-2 text-gray-700">Product Manager</label>
            </div>
          </div>
        </div>


        {/* Display error or success messages */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-2">Registration successful!</div>}

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          Register
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already registered? <Link to="/login" className="text-orange-500 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
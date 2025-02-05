import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { testSupabaseConnection } from '../services/api';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(1); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRoleChange = (e) => {
    setRole(parseInt(e.target.value));
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
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
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
  
        // Insert user into the 'users' table without specifying `user_id`
        const { data, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              // user_id is generated by the PostgreSQL sequence
              full_name: fullName,
              email: email,
              tax_id: taxId,
              phone_number: phone,
              role_id: role,
            },
          ])
          .select(); // Select the inserted row to retrieve the assigned `user_id`
  
        if (insertError) {
          console.error("Error inserting user into database:", insertError);
          setError("Failed to save user profile. Please try again.");
        } else {
          // The `data` object will include the `user_id` generated by the sequence
          const incrementedId = data[0].user_id;
  
          // Optionally, update user metadata with the `user_id`
          await supabase.auth.updateUser({
            data: {
              custom_incremented_id: incrementedId,
            },
          });
  
          // Create an associated cart for the new user
          const { error: cartError } = await supabase.from("cart").insert([
            {
              user_id: incrementedId, // Use the newly generated user ID
            },
          ]);
  
          if (cartError) {
            console.error("Error creating user cart:", cartError.message);
            setError("Failed to create a cart for the user.");
          } else {
            // Clear form and navigate to the login page
            setName("");
            setSurname("");
            setEmail("");
            setTaxId("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");
            navigate("/login");
          }
        }
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  
  return (
    <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        {/* Surname */}
        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        {/* Email */}
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

        {/* Tax ID */}
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input
            type="text"
            id="taxId"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        {/* Password */}
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

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#65aa92] focus:border-[#65aa92]"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <div className="flex space-x-6 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="customer"
                name="role"
                value={1}
                checked={role === 1}
                onChange={handleRoleChange}
                className="h-5 w-5 text-[#65aa92] focus:ring-[#65aa92] border-gray-300 rounded-full"
              />
              <label htmlFor="customer" className="ml-2 text-gray-700">Customer</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="salesManager"
                name="role"
                value={2}
                checked={role === 2}
                onChange={handleRoleChange}
                className="h-5 w-5 text-[#65aa92] focus:ring-[#65aa92] border-gray-300 rounded-full"
              />
              <label htmlFor="salesManager" className="ml-2 text-gray-700">Sales Manager</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="productManager"
                name="role"
                value={3}
                checked={role === 3}
                onChange={handleRoleChange}
                className="h-5 w-5 text-[#65aa92] focus:ring-[#65aa92] border-gray-300 rounded-full"
              />
              <label htmlFor="productManager" className="ml-2 text-gray-700">Product Manager</label>
            </div>
          </div>
        </div>

        {/* Error & Success Messages */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-2">Registration successful!</div>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#65aa92] text-white font-semibold rounded-md shadow hover:bg-[#4e8a70] focus:outline-none focus:ring-2 focus:ring-[#65aa92] focus:ring-opacity-50"
        >
          Register
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already registered? <Link to="/login" className="text-[#65aa92] hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterForm;

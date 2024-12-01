import React from 'react';
import { RegisterForm } from '../../components';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-7xl bg-white rounded-lg shadow-xl">
        {/* Form Section */}
        <div className="w-1/2 flex items-center justify-center px-16 py-8">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Create Your Account</h1>
            <p className="text-gray-600 mb-8">Sign up to explore and enjoy your favorite books.</p>
            <RegisterForm />
          </div>
        </div>

        {/* Image Section */}
        <div className="w-1/2 h-full flex items-start pt-40 pl-1"> {/* Adjust padding and margin */}
          <img
            src="/src/assets/bookstore.jpg" // Same image as login page
            alt="Bookstore"
            className="w-full h-auto object-cover rounded-r-lg transform -translate-x-5 translate-y-10" // Moves left and down
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

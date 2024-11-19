import React from 'react';
import { LoginForm } from '../components';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-7xl bg-white rounded-lg shadow-xl">

        <div className="w-1/2 flex items-center justify-center px-16 py-8">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600 mb-8">Sign in to continue exploring your favorite books.</p>
            <LoginForm />
          </div>
        </div>

        
        <div className="w-1/2 h-full">
          <img
            src="/src/assets/bookstore.jpg" 
            alt="Bookstore"
            className="w-full h-full object-cover rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { LoginForm } from '../components';

const LoginPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url('/src/assets/register-background.avif')" }}  
    >
      <LoginForm />
    </div>
  );
};

export default LoginPage;

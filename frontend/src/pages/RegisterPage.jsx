import React from 'react';
import {RegisterForm} from '../components';

const RegisterPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{backgroundImage: "url('/src/assets/register-background.avif')" }}
    >
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;

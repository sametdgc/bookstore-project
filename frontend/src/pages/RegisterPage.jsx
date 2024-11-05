import React from "react";
import { RegisterForm } from "../components";

const RegisterPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/register-background.avif')" }}
    >
      <RegisterForm />
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </div>
  );
};

export default RegisterPage;

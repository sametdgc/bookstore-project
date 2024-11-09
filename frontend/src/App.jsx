import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages';
import { RegisterPage } from './pages';
import { MainPage } from './pages'; 

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the main page */}
          <Route path="/" element={<MainPage />} />

          {/* Routes for login and register pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Fallback route: redirect to MainPage for any undefined path */}
          <Route path="*" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}
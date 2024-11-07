import { LoginPage } from './pages'
import { RegisterPage } from './pages'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import React, {useState, useEffect} from 'react';
import api from './api.js';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );

}
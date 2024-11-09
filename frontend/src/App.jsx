import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  MainPage,
  ShoppingCart,
  Wishlist,
  AllBooksPage,
} from "./pages";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the main page */}
          <Route path="/" element={<MainPage />} />

          {/* Route for the all books page */}
          <Route path="/all-books" element={<AllBooksPage />} />

          {/* Routes for login and register pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes for wishlist and cart pages */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<ShoppingCart />} />

          {/* Fallback route: redirect to MainPage for any undefined path */}
          <Route path="*" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

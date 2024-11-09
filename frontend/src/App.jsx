import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  MainPage,
  ShoppingCart,
  Wishlist, 
  BookDetailsPage,
  AllBooksPage,
} from "./pages";
import { TopNavBar } from "../src/components";

function App() {
  const location = useLocation();

  // Define paths where the navbar should be hidden
  const hideNavPaths = ["/login", "/register"];

  return (
    <div className="App">
      {/* Conditionally render TopNavBar based on the current path */}
      {!hideNavPaths.includes(location.pathname) && <TopNavBar />}
      
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/all-books" element={<AllBooksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books/:book_id" element={<BookDetailsPage />} />
        <Route path="/book-details" element={<BookDetailsPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

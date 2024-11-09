import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  MainPage,
  ShoppingCart,
  Wishlist, 
  BookDetailsPage,
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

          {/* Routes for book details pages*/}
          <Route path="/books/:bookId" element={<BookDetailsPage />} />

          {/* Temporary route to view BookDetailsPage with a dummy book ID */}
          <Route path="/book-details" element={<BookDetailsPage />} />

          {/* Routes for wishlist page*/}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Routes for cart page*/}
          <Route path="/cart" element={<ShoppingCart />} />

          {/* Fallback route: redirect to MainPage for any undefined path */}
          <Route path="*" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

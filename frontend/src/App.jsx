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
import { TopNavBar, SubscriptionBanner, Footer } from "./components";

function App() {
  const location = useLocation();

  // Define paths where TopNavBar, SubscriptionBanner, and Footer should be hidden
  const hideNavPaths = ["/login", "/register"];

  return (
    <div className="App">
      {/* Conditionally render TopNavBar based on the current path */}
      {!hideNavPaths.includes(location.pathname) && <TopNavBar />}

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/all-books" element={<AllBooksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books/:book_id" element={<BookDetailsPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="*" element={<MainPage />} />
      </Routes>

      {/* Conditionally render SubscriptionBanner and Footer based on the current path */}
      {!hideNavPaths.includes(location.pathname) && <SubscriptionBanner />}
      {!hideNavPaths.includes(location.pathname) && <Footer />}
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

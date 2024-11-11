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
  GenrePage
} from "./pages";
import { TopNavBar, SubscriptionBanner, Footer } from "./components";
import SearchPage from "./pages/SearchPage";

function App() {
  const location = useLocation();

  // Define paths where TopNavBar, SubscriptionBanner, and Footer should be hidden
  const hideNavPaths = ["/login", "/register"];

  return (
    <div className="App">
      {/* Conditionally render TopNavBar based on the current path */}
      {!hideNavPaths.includes(location.pathname) && <TopNavBar />}

      {/* Main Routes */}
      <div className="px-10 lg:px-20">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/all-books" element={<AllBooksPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books/:book_id" element={<BookDetailsPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/genre/:genreName" element={<GenrePage />} />
          <Route path="*" element={<MainPage />} />
        </Routes>
      </div>
      <SubscriptionBanner />
      <Footer />
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

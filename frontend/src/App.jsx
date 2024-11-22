import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  MainPage,
  ShoppingCart,
  Wishlist,
  BookDetailsPage,
  AllBooksPage,
  GenrePage,
  AboutPage,
  ReturnRefundPolicyPage,
  MyProfilePage,
  CheckoutPage,
  ContactPage,
} from "./pages";
import { TopNavBar, SubscriptionBanner, Footer } from "./components";
import SearchPage from "./pages/SearchPage";
import HelpAndSupportPage from "./pages/HelpAndSupportPage";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <TopNavBar />

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
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/return-refund-policy"
            element={<ReturnRefundPolicyPage />}
          />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/help-and-support" element={<HelpAndSupportPage />} />
          <Route path="/contact" element={<ContactPage />} />{" "}
          {/* <-- Add this route */}
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

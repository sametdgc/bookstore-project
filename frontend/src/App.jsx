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
  MyProfilePage,
  CheckoutPage,
  SearchPage,
  HelpAndSupportPage,
  InvoicePage,
} from "./pages/customerPages";

import { ContactPage, AboutPage, ReturnRefundPolicyPage } from "./pages/footerPages";
import { PMDashboard } from "./pages/pmPages";
import { TopNavBar, SubscriptionBanner, Footer } from "./components";


function App() {
  const location = useLocation();

  const hideLayoutPaths = ["/pm-dashboard"];

  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="App">
      {/* Conditionally render TopNavBar */}
      {!shouldHideLayout && <TopNavBar />}

      {/* Main Routes */}
      <div className={shouldHideLayout ? "" : "px-10 lg:px-20"}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books/:book_id" element={<BookDetailsPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/return-refund-policy"element={<ReturnRefundPolicyPage />}/>
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/help-and-support" element={<HelpAndSupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<MainPage />} />

          <Route path="/pm-dashboard" element={<PMDashboard />} />{" "}
        </Routes>
      </div>

      {/* {!shouldHideLayout && <SubscriptionBanner />} */}
      {!shouldHideLayout && <Footer />}
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

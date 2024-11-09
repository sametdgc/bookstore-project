import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-6">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} Chapter 0 Bookstore. All rights reserved.</p>
      <p>Follow us on social media</p>
      {/* Add social media icons or links here */}
    </div>
  </footer>
);

export default Footer;

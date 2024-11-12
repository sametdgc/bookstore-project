import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import visaLogo from '../../assets/visa-logo.png';
import mastercardLogo from '../../assets/logo-mastercard.png';
import troyLogo from '../../assets/troy-logo.png';
import bkmExpressLogo from '../../assets/bkm-express-logo.png';

import facebookLogo from '../../assets/facebook-logo.png';
import instagramLogo from '../../assets/instagram-logo.webp';
import twitterLogo from '../../assets/x-logo.svg';
import youtubeLogo from '../../assets/youtube-logo.png';

import appStoreLogo from '../../assets/app-store.png';
import playStoreLogo from '../../assets/play-store.png';

const Footer = () => (
  <footer style={{ backgroundColor: '#3b3b3b' }} className="text-white py-10">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Company Information */}
      <div>
        <h2 className="font-bold text-lg mb-2">Chapter 0 Bookstore</h2>
        <ul className="space-y-2">
          <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li> {/* Updated to Link */}
          <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
          <li><a href="#" className="text-gray-300 hover:text-white">Sustainability</a></li>
          <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
        </ul>
      </div>

      {/* Customer Support */}
      <div>
        <h2 className="font-bold text-lg mb-2">Customer Support</h2>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-300 hover:text-white">Help & Support</a></li>
          <li><a href="#" className="text-gray-300 hover:text-white">Shipping & Delivery</a></li>
          <li><Link to="/return-refund-policy" className="text-gray-300 hover:text-white">Return & Refund</Link></li>
          <li><a href="#" className="text-gray-300 hover:text-white">FAQs</a></li>
        </ul>
      </div>

      {/* Payment Methods */}
      <div>
        <h2 className="font-bold text-lg mb-2">Secure Payment</h2>
        <div className="flex space-x-4 mt-4">
          <img src={visaLogo} alt="Visa" className="h-8 object-contain" />
          <img src={mastercardLogo} alt="Mastercard" className="h-8 object-contain" />
          <img src={troyLogo} alt="Troy" className="h-8 object-contain" />
          <img src={bkmExpressLogo} alt="BKM Express" className="h-8 object-contain" />
        </div>
      </div>

      {/* Download Our App */}
      <div>
        <h2 className="font-bold text-lg mb-2">Download Our App</h2>
        <div className="flex space-x-4 mt-4">
          <a href="#" aria-label="Download on the App Store">
            <img src={appStoreLogo} alt="App Store" className="h-12 object-contain" />
          </a>
          <a href="#" aria-label="Get it on Google Play">
            <img src={playStoreLogo} alt="Google Play" className="h-12 object-contain" />
          </a>
        </div>
      </div>
    </div>

    {/* Social Media and Copyright */}
    <div className="container mx-auto px-4 mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row md:justify-between items-center">
      {/* Social Media Icons */}
      <div className="flex space-x-4 mb-4 md:mb-0">
        <a href="#" aria-label="Facebook">
          <img src={facebookLogo} alt="Facebook" className="h-6 w-6 object-contain" />
        </a>
        <a href="#" aria-label="Instagram">
          <img src={instagramLogo} alt="Instagram" className="h-6 w-6 object-contain" />
        </a>
        <a href="#" aria-label="Twitter">
          <img src={twitterLogo} alt="Twitter" className="h-6 w-6 object-contain" />
        </a>
        <a href="#" aria-label="YouTube">
          <img src={youtubeLogo} alt="YouTube" className="h-6 w-6 object-contain" />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-gray-400 text-sm text-center">
        &copy; {new Date().getFullYear()} Chapter 0 Bookstore. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

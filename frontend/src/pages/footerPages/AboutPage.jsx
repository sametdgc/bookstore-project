// src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => (
  <div className="flex flex-col items-center px-6 py-10 bg-gray-50 text-gray-800">
    <h1 className="text-4xl font-semibold text-gray-800 mb-12">About Chapter 0 Bookstore</h1>

    <div className="max-w-5xl w-full space-y-16">
      
      {/* Mission Section */}
      <section className="text-left">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Our Mission</h2>
        <span className="block w-16 h-1 mb-6" style={{ backgroundColor: '#65aa92' }}></span> {/* Shorter line */}
        <p className="text-lg text-gray-700 leading-relaxed">
          At Chapter 0 Bookstore, our mission is to foster a love for reading by providing a diverse and carefully curated selection of books. We believe that books are a gateway to knowledge, empathy, and imagination.
        </p>
      </section>

      {/* Values Section */}
      <section className="text-left">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Our Values</h2>
        <span className="block w-16 h-1 mb-6" style={{ backgroundColor: '#65aa92' }}></span> {/* Shorter line */}
        <ul className="list-none text-lg text-gray-700 leading-relaxed space-y-3">
          <li>
            <span className="font-medium">Curated Selections:</span> Every book is chosen for quality and diversity.
          </li>
          <li>
            <span className="font-medium">Community Engagement:</span> Partnering with local authors and organizations.
          </li>
          <li>
            <span className="font-medium">Customer Satisfaction:</span> Providing excellent service and a personalized experience.
          </li>
        </ul>
      </section>

      {/* Contact Information */}
      <section className="text-left">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Contact Us</h2>
        <span className="block w-16 h-1 mb-6" style={{ backgroundColor: '#65aa92' }}></span> {/* Shorter line */}
        <p className="text-lg text-gray-700">
          <span className="font-medium">Email:</span> contact@chapter0bookstore.com
        </p>
        <p className="text-lg text-gray-700 mt-2">
          <span className="font-medium">Address:</span> 123 Book St, Fiction City, 45678
        </p>
        <p className="text-lg text-gray-700 mt-2">
          <span className="font-medium">Phone:</span> (123) 456-7890
        </p>
      </section>
    </div>
  </div>
);

export default AboutPage;

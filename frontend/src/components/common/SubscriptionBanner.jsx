import React from 'react';

const SubscriptionBanner = () => (
  <div className="bg-gray-100 py-4 text-center">
    <p className="text-gray-600">Sign up for our emails</p>
    <div className="mt-2 flex justify-center">
      <input type="email" placeholder="Enter your email" className="border border-gray-300 p-2 rounded-l-md focus:outline-none" />
      <button className="bg-[#65aa92] text-white px-4 py-2 rounded-r-md hover:bg-green-600">Subscribe</button>
    </div>
  </div>
);

export default SubscriptionBanner;

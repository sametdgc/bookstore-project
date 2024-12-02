import React from "react";

const SubscriptionBanner = () => (
  <>
    {/* Newsletter Section */}
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter for the latest book releases and
            exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-md border-gray-300 focus:border-[#65aa92] focus:ring focus:ring-[#65aa92] focus:ring-opacity-50"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#65aa92] text-white font-semibold rounded-md hover:bg-[#528e79] transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  </>
);

export default SubscriptionBanner;

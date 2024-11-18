import React from 'react';

const ReturnRefundPolicy = () => (
  <div className="flex flex-col items-center px-6 py-10 bg-gray-50 text-gray-800">
    <h1 className="text-4xl font-bold text-center mb-10">Return & Refund Policy</h1>
    
    {/* Main Content Wrapper with max-w-5xl */}
    <div className="max-w-5xl w-full space-y-16">
      
      {/* Overview Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Overview</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          At <strong>Chapter 0 Bookstore</strong>, we strive to ensure our customers are completely satisfied with their purchases. If you are not entirely happy with your order, we offer a return and refund policy to facilitate an easy return process within 30 days of purchase.
        </p>
      </section>

      {/* Return Eligibility Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Return Eligibility</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          - Items can be returned within 30 days from the date of purchase, provided they are in their original condition, including packaging, labels, and accessories.
        </p>
        <p className="text-lg leading-relaxed mt-2">
          - Certain items, such as gift cards, personalized products, or digital downloads, may not be eligible for return.
        </p>
        <p className="text-lg leading-relaxed mt-2">
          - A valid invoice or proof of purchase is required to process the return.
        </p>
      </section>

      {/* Return Process Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Return Process</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          To initiate a return, please log in to your account on our website, navigate to <strong>Order History</strong>, select the product you wish to return, and click <strong>Request Return</strong>. Our team will review your request and provide instructions for returning the product.
        </p>
      </section>

      {/* Refunds Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Refunds</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refunded amount will match the price paid at the time of purchase, including any discounts applied.
        </p>
        <p className="text-lg leading-relaxed mt-2">
          Refunds will be processed to the original payment method and may take 5-7 business days to reflect in your account, depending on your bank or card issuer.
        </p>
      </section>

      {/* Special Conditions Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Special Conditions</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          - If the product was purchased during a discount campaign, the refunded amount will be based on the discounted price.
        </p>
        <p className="text-lg leading-relaxed mt-2">
          - If you received a defective or damaged item, please contact our support team immediately. We will arrange a replacement or refund at no additional cost.
        </p>
        <p className="text-lg leading-relaxed mt-2">
          - Original shipping fees are non-refundable unless the return is due to an error on our part. Return shipping costs are the customer’s responsibility.
        </p>
      </section>

      {/* Refund Approval Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Refund Approval</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          Refunds are subject to approval by our <strong>Team</strong>. Upon receiving the returned product, our team will verify that it meets the return policy criteria. Once approved, the refund will be issued.
        </p>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-1">Contact Us</h2>
        <div className="w-24 h-1 bg-[#65aa92] mb-4"></div>
        <p className="text-lg leading-relaxed">
          For additional assistance with returns and refunds, please contact our support team:
        </p>
        <p className="text-lg leading-relaxed mt-2">
          <strong>Email:</strong> support@chapter0bookstore.com
        </p>
        <p className="text-lg leading-relaxed mt-2">
          <strong>Phone:</strong> (123) 456-7890
        </p>
        <p className="text-lg leading-relaxed mt-2">
          <strong>Address:</strong> 123 Book St, Fiction City, 45678
        </p>
      </section>
    </div>
  </div>
);

export default ReturnRefundPolicy;

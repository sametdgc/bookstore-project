import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

const ReturnRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#65aa92] mb-8">
          Return & Refund Policy
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Overview
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            At <strong>Chapter 0 Bookstore</strong>, we strive to ensure our
            customers are completely satisfied with their purchases. If you are
            not entirely happy with your order, we offer a return and refund
            policy to facilitate an easy return process within 30 days of
            purchase.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Policy Details
          </h2>
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger>Return Eligibility</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Items can be returned within 30 days from the date of
                    purchase, provided they are in their original condition,
                    including packaging, labels, and accessories.
                  </li>
                  <li>
                    Certain items, such as gift cards, personalized products, or
                    digital downloads, may not be eligible for return.
                  </li>
                  <li>
                    A valid invoice or proof of purchase is required to process
                    the return.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Return Process</AccordionTrigger>
              <AccordionContent>
                <p>
                  To initiate a return, please log in to your account on our
                  website, navigate to <strong>Order History</strong>, select
                  the product you wish to return, and click{" "}
                  <strong>Request Return</strong>. Our team will review your
                  request and provide instructions for returning the product.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Refunds</AccordionTrigger>
              <AccordionContent>
                <p>
                  Once your return is received and inspected, we will notify you
                  of the approval or rejection of your refund. If approved, the
                  refunded amount will match the price paid at the time of
                  purchase, including any discounts applied.
                </p>
                <p className="mt-2">
                  Refunds will be processed to the original payment method and
                  may take 5-7 business days to reflect in your account,
                  depending on your bank or card issuer.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Special Conditions</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    If the product was purchased during a discount campaign, the
                    refunded amount will be based on the discounted price.
                  </li>
                  <li>
                    If you received a defective or damaged item, please contact
                    our support team immediately. We will arrange a replacement
                    or refund at no additional cost.
                  </li>
                  <li>
                    Original shipping fees are non-refundable unless the return
                    is due to an error on our part. Return shipping costs are
                    the customer's responsibility.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Refund Approval</AccordionTrigger>
              <AccordionContent>
                <p>
                  Refunds are subject to approval by our <strong>Team</strong>.
                  Upon receiving the returned product, our team will verify that
                  it meets the return policy criteria. Once approved, the refund
                  will be issued.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Contact Us
          </h2>
          <p className="mb-4">
            For additional assistance with returns and refunds, please contact
            our support team:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center">
              <span className="mr-2 text-[#65aa92]">✉️</span>
              <span>Email: support@chapter0bookstore.com</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-[#65aa92]">📍</span>
              <span>Address: 123 Book St, Fiction City, 45678</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-[#65aa92]">📞</span>
              <span>Phone: (123) 456-7890</span>
            </li>
          </ul>
          <Link to="/help-and-support">
            <Button className="w-full">Visit Help and Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;

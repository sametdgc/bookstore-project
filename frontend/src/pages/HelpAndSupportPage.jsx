import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/Accordion";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const HelpAndSupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#65aa92] mb-8">
          Help and Support
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Frequently Asked Questions
          </h2>
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I place an order?</AccordionTrigger>
              <AccordionContent>
                To place an order, browse our collection, add items to your
                cart, and proceed to checkout. Follow the prompts to enter your
                shipping and payment information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent>
                We accept major credit cards (Visa, MasterCard, American
                Express), PayPal, and bank transfers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long does shipping take?</AccordionTrigger>
              <AccordionContent>
                Shipping times vary depending on your location. Typically,
                domestic orders are delivered within 3-5 business days, while
                international orders may take 7-14 business days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                For detailed information about our return policy, please visit
                our{" "}
                <Link
                  to="/return-refund-policy"
                  className="text-[#65aa92] hover:underline"
                >
                  Return & Refund Policy
                </Link>{" "}
                page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Do you offer gift wrapping?</AccordionTrigger>
              <AccordionContent>
                Unfortunately, we do not currently offer gift wrapping services.
                However, we carefully package all orders to ensure they arrive
                in excellent condition.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Contact Us
          </h2>
          <p className="mb-4">
            Have questions or need assistance? Our customer support team is here
            to help!
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center">
              <span className="mr-2 text-[#65aa92]">✉️</span>
              <span>Email: contact@chapter0bookstore.com</span>
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
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <Input type="text" id="name" name="name" required />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
                required
              ></textarea>
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupportPage;

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Link } from "react-router-dom";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#65aa92] mb-8">
          Contact Us
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Get in Touch
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            We'd love to hear from you! Whether you have a question about our
            books, need assistance with an order, or just want to share your
            thoughts, our team is here to help.
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

        <div className="bg-white shadow rounded-lg p-6 mb-8">
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
              <Input id="name" name="name" required />
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
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <Input id="subject" name="subject" required />
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

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Frequently Asked Questions
          </h2>
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What are your shipping options?
              </AccordionTrigger>
              <AccordionContent>
                We offer a variety of shipping options to suit your needs. You
                can choose from standard, expedited, or express delivery at
                checkout. Shipping fees and delivery times vary depending on
                your location.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent>
                Once your order has shipped, you will receive a tracking number
                via email. You can use this number to track the status of your
                shipment directly on the courier's website.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I change or cancel my order?
              </AccordionTrigger>
              <AccordionContent>
                We process orders quickly, but if you need to make a change or
                cancel your order, please contact our support team as soon as
                possible. We will do our best to accommodate your request before
                the order ships.
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
              <AccordionTrigger>Do you offer gift cards?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer digital gift cards that can be used to purchase
                any items on our website. You can choose the amount and send the
                gift card to your recipient via email.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

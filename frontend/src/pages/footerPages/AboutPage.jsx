import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#65aa92] mb-8">
          About Chapter 0 Bookstore
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Our Story
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            Chapter 0 Bookstore was founded with a passion for literature and a
            vision to create a haven for book lovers. Our journey began with a
            simple idea: to provide a carefully curated selection of books that
            inspire, educate, and entertain.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Our Mission and Values
          </h2>
          <Accordion>
            <AccordionItem value="mission">
              <AccordionTrigger>Our Mission</AccordionTrigger>
              <AccordionContent>
                <p className="text-lg leading-relaxed">
                  At Chapter 0 Bookstore, our mission is to foster a love for
                  reading by providing a diverse and carefully curated selection
                  of books. We believe that books are a gateway to knowledge,
                  empathy, and imagination.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="values">
              <AccordionTrigger>Our Values</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2 text-lg">
                  <li>
                    <strong>Curated Selections:</strong> Every book is chosen
                    for quality and diversity.
                  </li>
                  <li>
                    <strong>Community Engagement:</strong> Partnering with local
                    authors and organizations.
                  </li>
                  <li>
                    <strong>Customer Satisfaction:</strong> Providing excellent
                    service and a personalized experience.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            What Sets Us Apart
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            At Chapter 0 Bookstore, we're more than just a bookstore. We're a
            community of book lovers, a source of literary discoveries, and a
            place where stories come to life. Our knowledgeable staff, author
            events, and reading groups create an immersive experience for all
            book enthusiasts.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#65aa92]">
            Contact Us
          </h2>
          <p className="mb-4">
            We'd love to hear from you! Whether you have a question about a
            book, want to suggest a title, or just want to chat about
            literature, don't hesitate to reach out.
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
          <Link to="/help-and-support">
            <Button className="w-full">Visit Help and Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

import React from "react";
import { render, screen } from "@testing-library/react";
import OrderSummary from "../../components/checkoutPage/OrderSummary"; 
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom';

describe("OrderSummary Component", () => {
  const mockCart = [
    {
      book_id: 1,
      book: {
        book_id: 1,
        title: "Book One",
        price: 10.99,
        image_url: "https://via.placeholder.com/50x75",
      },
      quantity: 2,
    },
    {
      book_id: 2,
      book: {
        book_id: 2,
        title: "Book Two",
        price: 20.5,
        image_url: "https://via.placeholder.com/50x75",
      },
      quantity: 1,
    },
  ];
  const mockShippingCost = 5.0;
  const mockCalculateTotalPrice = jest.fn(() =>
    mockCart.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    ) + mockShippingCost
  );

  const setup = () => {
    render(
      <Router>
        <OrderSummary
          cart={mockCart}
          shippingCost={mockShippingCost}
          calculateTotalPrice={mockCalculateTotalPrice}
        />
      </Router>
    );
  };

  test("renders order summary correctly", () => {
    setup();

    // Check the heading
    expect(screen.getByText("Order Summary")).toBeInTheDocument();

    // Check book titles
    expect(screen.getByText("Book One")).toBeInTheDocument();
    expect(screen.getByText("Book Two")).toBeInTheDocument();

    // Check book prices
    expect(screen.getByText("$10.99 x 2")).toBeInTheDocument();
    expect(screen.getByText("$20.50 x 1")).toBeInTheDocument();

    // Check book totals
    expect(screen.getByText("$21.98")).toBeInTheDocument(); // 10.99 * 2
    expect(screen.getByText("$20.50")).toBeInTheDocument(); // 20.50 * 1
  });

  test("calculates subtotal, shipping, and total correctly", () => {
    setup();

    // Check subtotal
    expect(screen.getByText("Subtotal:")).toBeInTheDocument();
    expect(screen.getByText("$42.48")).toBeInTheDocument(); // 21.98 + 20.50

    // Check shipping
    expect(screen.getByText("Shipping:")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();

    // Check total
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("$47.48")).toBeInTheDocument(); // 42.48 + 5.00

    // Ensure the calculateTotalPrice function was called
    expect(mockCalculateTotalPrice).toHaveBeenCalled();
  });

  test("renders book links correctly", () => {
    setup(); // Call the setup function to render the component
    
    const allLinks = screen.getAllByRole('link');
  
    expect(allLinks.length).toBe(4); // Two links per book
    expect(allLinks[0].getAttribute('href')).toBe('/books/1'); // Image link for Book One
    expect(allLinks[1].getAttribute('href')).toBe('/books/1'); // Title link for Book One
    expect(allLinks[2].getAttribute('href')).toBe('/books/2'); // Image link for Book Two
    expect(allLinks[3].getAttribute('href')).toBe('/books/2'); // Title link for Book Two

  });
});

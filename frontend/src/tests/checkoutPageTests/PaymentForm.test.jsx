import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentForm from "../../components/checkoutPage/PaymentForm";
import "@testing-library/jest-dom";


describe("PaymentForm Component", () => {
  const mockOnInputChange = jest.fn(); 
  const defaultCardDetails = {
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  };
  const defaultErrors = {};

  test("renders all input fields correctly", () => {
    render(
      <PaymentForm
        cardDetails={defaultCardDetails}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />
    );

    // Check for placeholders in input fields
    expect(screen.getByPlaceholderText("Card Number (16 digits)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cardholder Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM/YY")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("CVV (3 digits)")).toBeInTheDocument();
  });

  test("displays error messages when errors are passed", () => {
    const errors = {
      cardNumber: "Invalid card number",
      cardholderName: "Name is required",
      expiryDate: "Invalid expiry date",
      cvv: "Invalid CVV",
    };

    render(
      <PaymentForm
        cardDetails={defaultCardDetails}
        errors={errors}
        onInputChange={mockOnInputChange}
      />
    );

    // Check for error messages
    expect(screen.getByText("Invalid card number")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid expiry date")).toBeInTheDocument();
    expect(screen.getByText("Invalid CVV")).toBeInTheDocument();
  });

  test("applies error styles to inputs with errors", () => {
    const errors = { cardNumber: "Invalid card number" };

    render(
      <PaymentForm
        cardDetails={defaultCardDetails}
        errors={errors}
        onInputChange={mockOnInputChange}
      />
    );

    // Check if the input with error has the correct class
    const cardNumberInput = screen.getByPlaceholderText("Card Number (16 digits)");
    expect(cardNumberInput).toHaveClass("border-red-500");
  });
});

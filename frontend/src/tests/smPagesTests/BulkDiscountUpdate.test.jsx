import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BulkDiscountUpdate from "src/pages/smPages/sections/bulkDiscountManager";
import { applyDiscountToBook, endAllActiveDiscounts } from "src/services/api";

// Mock API services
jest.mock("src/services/api", () => ({
  applyDiscountToBook: jest.fn(),
  endAllActiveDiscounts: jest.fn(),
}));

describe("BulkDiscountUpdate Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test("renders all required input fields", () => {
    render(<BulkDiscountUpdate />);

    // Check if input fields are rendered
    expect(screen.getByPlaceholderText("Enter discount name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter discount rate")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select end date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Book ID #1")).toBeInTheDocument();
  });

  test("displays validation errors for empty fields", async () => {
    render(<BulkDiscountUpdate />);

    // Click on the Apply Bulk Discount button
    fireEvent.click(screen.getByText("Apply Bulk Discount"));

    // Validation errors should be displayed
    expect(await screen.findByText("Discount name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Discount rate must be greater than 0 and less than 100.")).toBeInTheDocument();
    expect(await screen.findByText("End date is required.")).toBeInTheDocument();
    expect(await screen.findByText("All book ID fields must be filled.")).toBeInTheDocument();
  });

  test("adds a new book ID field when Add Book ID Field button is clicked", () => {
    render(<BulkDiscountUpdate />);

    // Add a new book ID field
    fireEvent.click(screen.getByText("Add Book ID Field"));

    // Check if a second input field is added
    expect(screen.getAllByPlaceholderText(/Book ID #/).length).toBe(2);
  });

  test("removes a book ID field when Remove button is clicked", () => {
    render(<BulkDiscountUpdate />);

    // Add two book ID fields
    fireEvent.click(screen.getByText("Add Book ID Field"));
    fireEvent.click(screen.getByText("Add Book ID Field"));

    // Remove one book ID field
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    // Check if only two book ID fields remain
    expect(screen.getAllByPlaceholderText(/Book ID #/).length).toBe(2);
  });

  test("displays a confirmation popup when inputs are valid", async () => {
    render(<BulkDiscountUpdate />);

    // Fill out all fields with valid data
    fireEvent.change(screen.getByPlaceholderText("Enter discount name"), {
      target: { value: "Summer Sale" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter discount rate"), {
      target: { value: 20 },
    });
    fireEvent.change(screen.getByPlaceholderText("Select end date"), {
      target: { value: "2025-12-31" },
    });
    fireEvent.change(screen.getByPlaceholderText("Book ID #1"), {
      target: { value: "12345" },
    });

    // Click on the Apply Bulk Discount button
    fireEvent.click(screen.getByText("Apply Bulk Discount"));

    // Wait for confirmation popup to appear
    expect(
      await screen.findByText(
        "Applying a new discount will deactivate all currently active discounts for the specified books. Do you wish to continue?"
      )
    ).toBeInTheDocument();
  });

  test("calls API functions when confirmation is accepted", async () => {
    render(<BulkDiscountUpdate />);

    // Fill out all fields with valid data
    fireEvent.change(screen.getByPlaceholderText("Enter discount name"), {
      target: { value: "Summer Sale" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter discount rate"), {
      target: { value: 20 },
    });
    fireEvent.change(screen.getByPlaceholderText("Select end date"), {
      target: { value: "2025-12-31" },
    });
    fireEvent.change(screen.getByPlaceholderText("Book ID #1"), {
      target: { value: "12345" },
    });

    // Click on the Apply Bulk Discount button
    fireEvent.click(screen.getByText("Apply Bulk Discount"));

    // Confirm in the popup
    const yesButton = await screen.findByText("Yes");
    fireEvent.click(yesButton);

    // Wait for API calls
    await waitFor(() => {
      expect(endAllActiveDiscounts).toHaveBeenCalledWith("12345");
      expect(applyDiscountToBook).toHaveBeenCalledWith("12345", "Summer Sale", 20, "2025-12-31");
    });
  });

  test("displays a success message after discounts are applied", async () => {
    applyDiscountToBook.mockResolvedValue({ error: null }); // Mock success response

    render(<BulkDiscountUpdate />);

    // Fill out all fields with valid data
    fireEvent.change(screen.getByPlaceholderText("Enter discount name"), {
      target: { value: "Summer Sale" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter discount rate"), {
      target: { value: 20 },
    });
    fireEvent.change(screen.getByPlaceholderText("Select end date"), {
      target: { value: "2025-12-31" },
    });
    fireEvent.change(screen.getByPlaceholderText("Book ID #1"), {
      target: { value: "12345" },
    });

    // Click on the Apply Bulk Discount button
    fireEvent.click(screen.getByText("Apply Bulk Discount"));

    // Confirm in the popup
    const yesButton = await screen.findByText("Yes");
    fireEvent.click(yesButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText("1 discounts successfully applied!")).toBeInTheDocument();
    });
  });
});

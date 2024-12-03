import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddressSelector from "../../components/checkoutPage/AddressSelector";
import { getUserAddresses, addNewAddress, deleteAddress } from "../../services/api";
import "@testing-library/jest-dom"; // Import this to use `toBeInTheDocument`

// Mock API calls
jest.mock("../../services/api");

beforeAll(() => {
  // Mock the window.confirm to return true
  global.window.confirm = jest.fn(() => true);
});

describe("AddressSelector", () => {
  const userId = 1;

  test("renders 'Add a new address' button", () => {
    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);
    expect(screen.getByText("Add a new address")).toBeInTheDocument();
  });
  test("fetches and displays user addresses", async () => {
    getUserAddresses.mockResolvedValue([
      { address_id: 1, address_title: "Home", address: { city: "New York" } },
    ]);
  
    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);
  
    // Wait for the API call to complete
    await waitFor(() => expect(getUserAddresses).toHaveBeenCalledWith(userId));
  
    // Flexible text matching
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("New York"))).toBeInTheDocument();
  });
  
  test("handles adding a new address", async () => {
  render(<AddressSelector userId={userId} onAddressSelect={mockOnAddressSelect} />);

  // Open the "Add a new address" modal
  fireEvent.click(screen.getByText("Add a new address"));
  await waitFor(() => expect(screen.getByText("Add New Address")).toBeInTheDocument());

  // Use getByLabelText to find inputs by their labels
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: "New Address" } });
  fireEvent.change(screen.getByLabelText("Address Details"), {
    target: { value: "123 Test St" },
  });
  fireEvent.change(screen.getByLabelText("City"), { target: { value: "Test City" } });
  fireEvent.change(screen.getByLabelText("District"), { target: { value: "Test District" } });
  fireEvent.change(screen.getByLabelText("ZIP Code"), { target: { value: "12345" } });

  // Submit the form
  fireEvent.click(screen.getByText("Add"));

  // Wait for the new address to appear in the list
  await waitFor(() => expect(addNewAddress).toHaveBeenCalled());
  expect(screen.getByText("New Address")).toBeInTheDocument();
  expect(screen.getByText((content) => content.includes("Test City"))).toBeInTheDocument();
});

  test("handles deleting an address", async () => {
    getUserAddresses.mockResolvedValue([
      { address_id: 1, address_title: "Home", address: { city: "New York" } },
    ]);
    deleteAddress.mockResolvedValue({ success: true });

    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);

    // Wait for addresses to load
    await waitFor(() => expect(screen.getByText("Home")).toBeInTheDocument());

    // Click the delete button
    const deleteButton = screen.getByTitle("Delete");
    fireEvent.click(deleteButton);

    // Verify the API call
    await waitFor(() => expect(deleteAddress).toHaveBeenCalledWith(1));
  });
});

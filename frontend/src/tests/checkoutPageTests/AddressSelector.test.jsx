import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddressSelector from "../../components/checkoutPage/AddressSelector";
import { getUserAddresses, addNewAddress, deleteAddress } from "../../services/api";
import "@testing-library/jest-dom";

jest.mock("../../services/api", () => ({
  getUserAddresses: jest.fn(),
  addNewAddress: jest.fn(),
  deleteAddress: jest.fn(),
}));

describe("AddressSelector Component", () => {
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    global.confirm = jest.fn(() => true); // Mock window.confirm
  });

  test("renders 'Add a new address' button", () => {
    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);
    expect(screen.getByText("Add a new address")).toBeInTheDocument();
  });

  test("fetches and displays user addresses", async () => {
    getUserAddresses.mockResolvedValue([
      {
        address_id: 1,
        address_title: "Home",
        address: { city: "New York", district: "Manhattan", zip_code: "10001" },
      },
    ]);

    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);

    await waitFor(() => expect(getUserAddresses).toHaveBeenCalledWith(userId));
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Manhattan, New York")).toBeInTheDocument();
  });

  test("handles adding a new address using input values", async () => {
    addNewAddress.mockResolvedValue({ success: true });
  
    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);
  
    fireEvent.click(screen.getByText("Add a new address"));
    await waitFor(() =>
      expect(screen.getByText("Add New Address")).toBeInTheDocument()
    );
  
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Work" } });
    fireEvent.change(inputs[1], { target: { value: "123 Test St" } });
    fireEvent.change(inputs[2], { target: { value: "Test City" } });
    fireEvent.change(inputs[3], { target: { value: "Test District" } });
    fireEvent.change(inputs[4], { target: { value: "12345" } });
  
    fireEvent.click(screen.getByText("Add"));
  
    // Verify input values
    await waitFor(() =>
      expect(screen.getByDisplayValue("Work")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByDisplayValue("123 Test St")).toBeInTheDocument()
    );
  });
  
  
  test("handles deleting an address", async () => {
    getUserAddresses.mockResolvedValue([
      { address_id: 1, address_title: "Home", address: { city: "New York" } },
    ]);
    deleteAddress.mockResolvedValue({ success: true });

    render(<AddressSelector userId={userId} onAddressSelect={() => {}} />);

    await waitFor(() => expect(screen.getByText("Home")).toBeInTheDocument());

    fireEvent.click(screen.getByTitle("Delete")); // Ensure the "Delete" button exists in your component
    await waitFor(() => expect(deleteAddress).toHaveBeenCalledWith(1));
  });

  test("selects an address and calls onAddressSelect callback", async () => {
    const mockOnAddressSelect = jest.fn();

    getUserAddresses.mockResolvedValue([
      { address_id: 1, address_title: "Home", address: { city: "New York" } },
    ]);

    render(<AddressSelector userId={userId} onAddressSelect={mockOnAddressSelect} />);

    await waitFor(() => expect(screen.getByText("Home")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Home"));
    expect(mockOnAddressSelect).toHaveBeenCalledWith(1);
  });
});
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddBookPage from "../pages/pmPages/sections/AddBookPage";
import AddGenrePage from "../pages/pmPages/sections/AddGenrePage";
import DeleteByGenrePage from "../pages/pmPages/sections/DeleteByGenrePage";
import ProductManagement from "../pages/pmPages/sections/ProductManagement";
import DeliveryDetails from "../pages/pmPages/sections/DeliveryDetails";
import { useNavigate } from "react-router-dom";

// Mock services and useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../services/api/bookServices", () => ({
  getAllBooks: jest.fn(),
  searchBooks: jest.fn(),
}));

jest.mock("../services/api", () => ({
  getDeliveryStatuses: jest.fn(),
  updateDeliveryStatus: jest.fn(),
}));

describe("PM Pages Tests", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks(); // Clear all mocks before each test
  });

  // Tests for AddBookPage
  describe("AddBookPage Component", () => {
    test("renders all input fields", () => {
      render(<AddBookPage />, { wrapper: MemoryRouter });

      expect(screen.getByPlaceholderText("Book ID *")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Title *")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Description *")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Price *")).toBeInTheDocument();
    });

    test("renders the Add Book button", () => {
      render(<AddBookPage />, { wrapper: MemoryRouter });

      expect(screen.getByRole("button", { name: /Add Book/i })).toBeInTheDocument();
    });
  });

  // Tests for AddGenrePage
  describe("AddGenrePage Component", () => {
    test("renders input fields for genre", () => {
      render(<AddGenrePage />, { wrapper: MemoryRouter });

      expect(screen.getByPlaceholderText("Genre ID *")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Genre Name *")).toBeInTheDocument();
    });

    test("renders the Add Genre button", () => {
      render(<AddGenrePage />, { wrapper: MemoryRouter });

      expect(screen.getByRole("button", { name: /Add Genre/i })).toBeInTheDocument();
    });
  });

  // Tests for DeleteByGenrePage
  describe("DeleteByGenrePage Component", () => {
    test("renders genre dropdown", () => {
      render(<DeleteByGenrePage />, { wrapper: MemoryRouter });

      expect(screen.getByLabelText(/Select Genre/i)).toBeInTheDocument();
    });

    test("shows an error if no genre is selected and delete is attempted", async () => {
      render(<DeleteByGenrePage />, { wrapper: MemoryRouter });

      fireEvent.click(screen.getByRole("button", { name: /Delete Books and Genre/i }));

      await waitFor(() => {
        expect(screen.getByText(/Please select a genre/i)).toBeInTheDocument();
      });
    });
  });

  // Tests for ProductManagement
  describe("ProductManagement Component", () => {
    const { getAllBooks, searchBooks } = require("../services/api/bookServices");

    beforeEach(() => {
      getAllBooks.mockResolvedValue([
        { book_id: 1, title: "Test Book", price: 10, available_quantity: 5 },
      ]);
    });

    test("renders Manage Books page and table", async () => {
      render(<ProductManagement />, { wrapper: MemoryRouter });

      await waitFor(() => {
        expect(screen.getByText(/Manage Books/i)).toBeInTheDocument();
      });

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    test("searches books and updates table", async () => {
      searchBooks.mockResolvedValue([
        { book_id: 2, title: "Search Book", price: 20, available_quantity: 10 },
      ]);

      render(<ProductManagement />, { wrapper: MemoryRouter });

      fireEvent.change(screen.getByPlaceholderText(/Search books by name.../i), { target: { value: "Search" } });
      fireEvent.click(screen.getByRole("button", { name: /Search/i }));

      await waitFor(() => {
        expect(screen.getByText(/Search Book/i)).toBeInTheDocument();
      });
    });

    test("renders a message when no books are found", async () => {
      getAllBooks.mockResolvedValue([]);

      render(<ProductManagement />, { wrapper: MemoryRouter });

      await waitFor(() => {
        expect(screen.getByText(/No books found/i)).toBeInTheDocument();
      });
    });

    test("disables pagination buttons correctly", async () => {
      getAllBooks.mockResolvedValue([
        { book_id: 1, title: "Test Book", price: 10, available_quantity: 5 },
      ]);

      render(<ProductManagement />, { wrapper: MemoryRouter });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
      });
    });
  });

  // Tests for DeliveryDetails
  describe("DeliveryDetails Component", () => {
    const { getDeliveryStatuses } = require("../services/api");

    beforeEach(() => {
      getDeliveryStatuses.mockResolvedValue({
        data: [
          { order_id: 1, order: { users: { full_name: "John Doe" } }, status: "processing" },
        ],
        count: 1,
      });
    });

    test("renders Delivery Details page and table", async () => {
      const mockDeliveryData = [
        {
          delivery_id: 1,
          order_id: 101,
          status: "processing",
          order: {
            users: { full_name: "John Doe", user_id: 1 },
            address: {
              address_details: "123 Main St",
              district: "Central",
              city: "Metropolis",
            },
            order_items: [
              { book_id: 201, quantity: 2 },
              { book_id: 202, quantity: 1 },
            ],
            total_price: 45.99,
          },
        },
      ];
    
      getDeliveryStatuses.mockResolvedValue({ data: mockDeliveryData, count: 1 });
    
      render(<DeliveryDetails />, { wrapper: MemoryRouter });
    
      // Wait for the data to load
      await waitFor(() => {
        expect(screen.getByText(/Delivery Details/i)).toBeInTheDocument();
      });
    
      // Get all tables and target the main one
      const tables = screen.getAllByRole("table");
      const mainTable = tables[0]; // Assuming the first table is the delivery table
      expect(mainTable).toBeInTheDocument();
    
      // Verify the content in the main table
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("123 Main St, Central, Metropolis")).toBeInTheDocument();
      expect(screen.getByText("$45.99")).toBeInTheDocument();
      expect(screen.getByText("processing")).toBeInTheDocument();
    });
    

    test("renders a message when no delivery data is available", async () => {
      getDeliveryStatuses.mockResolvedValue({ data: [], count: 0 });

      render(<DeliveryDetails />, { wrapper: MemoryRouter });

      await waitFor(() => {
        expect(screen.getByText(/No delivery data available/i)).toBeInTheDocument();
      });
    });

    // New Test 1: DeliveryDetails - Checks dropdown default selection
    test("displays default status in the dropdown correctly", async () => {
      const mockDeliveryData = [
        {
          delivery_id: 1,
          order_id: 101,
          status: "processing",
          order: {
            users: { full_name: "John Doe", user_id: 1 },
            address: {
              address_details: "123 Main St",
              district: "Central",
              city: "Metropolis",
            },
            order_items: [{ book_id: 201, quantity: 2 }],
            total_price: 45.99,
          },
        },
      ];
    
      getDeliveryStatuses.mockResolvedValue({ data: mockDeliveryData, count: 1 });
    
      render(<DeliveryDetails />, { wrapper: MemoryRouter });
    
      // Wait for the data to load
      await waitFor(() => {
        expect(screen.getByText(/Delivery Details/i)).toBeInTheDocument();
      });
    
      // Check if the dropdown displays the correct default status
      const dropdown = screen.getByDisplayValue(/processing/i);
      expect(dropdown).toBeInTheDocument();
    });
    

    // New Test 2: DeliveryDetails - Validates loading spinner behavior
    test("displays and hides the loading spinner appropriately", async () => {
      const mockDeliveryData = [
        {
          delivery_id: 1,
          order_id: 101,
          status: "processing",
          order: {
            users: { full_name: "John Doe", user_id: 1 },
            address: {
              address_details: "123 Main St",
              district: "Central",
              city: "Metropolis",
            },
            order_items: [
              { book_id: 201, quantity: 2 },
            ],
            total_price: 45.99,
          },
        },
      ];
    
      getDeliveryStatuses.mockResolvedValue({ data: mockDeliveryData, count: 1 });
    
      render(<DeliveryDetails />, { wrapper: MemoryRouter });
    
      // Verify the loading spinner is displayed
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    
      // Wait for the data to load and check that the spinner disappears
      await waitFor(() => {
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      });
    });
    
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainContent from "../../components/mainPage/MainContent";
import { getBestSellingBooks, getNewBooks, getBookDetailsById, getLocalWishlistItems } from "../../services/api";
import "@testing-library/jest-dom";

// Mock the API functions
jest.mock("../../services/api");

describe("MainContent Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders book categories with books when API resolves", async () => {
    // Mock successful API responses
    getLocalWishlistItems.mockReturnValue([{ book_id: 1 }, { book_id: 2 },{ book_id: 6 },{ book_id: 7}, { book_id: 8}, { book_id: 9}]);
    const mockNewBooks = [
      { book_id: 1, title: "New Book", image_url: "url1", author_name: "Author A", price: 10 },
    ];
    const mockBestsellers = [
      { book_id: 2, title: "Bestseller", image_url: "url2", author_name: "Author B", price: 20 },
    ];
    const mockStaffPicks = [
      { book_id: 6, title: "Staff Pick 6", image_url: "url3", author_name: "Author C", price: 30 },
      { book_id: 7, title: "Staff Pick 7", image_url: "url4", author_name: "Author D", price: 25 },
      { book_id: 8, title: "Staff Pick 8", image_url: "ursdl3", author_name: "Autsdhor C", price: 303 },
      { book_id: 9, title: "Staff Pick 9", image_url: "usdrl4", author_name: "Authsdor D", price: 252 },
    ];

    // Mock API calls
    getNewBooks.mockResolvedValue(mockNewBooks);
    getBestSellingBooks.mockResolvedValue(mockBestsellers);
    getBookDetailsById.mockImplementation((id) =>
      Promise.resolve(mockStaffPicks.find((book) => book.book_id === id))
    );

    render(
      <MemoryRouter>
        <MainContent />
      </MemoryRouter>
    );

    // Wait for all data to load
    await waitFor(() => {
      // Category Headers
      expect(screen.getByText("New Releases")).toBeInTheDocument();
      expect(screen.getByText("Bestsellers")).toBeInTheDocument();
      expect(screen.getByText("Staff Picks")).toBeInTheDocument();

      // Check New Releases
      expect(screen.getByText("New Book")).toBeInTheDocument();
      // Check Bestsellers
      expect(screen.getByText("Bestseller")).toBeInTheDocument();
      // Check Staff Picks
      expect(screen.getByText("Staff Pick 6")).toBeInTheDocument();
      expect(screen.getByText("Staff Pick 7")).toBeInTheDocument();
      expect(screen.getByText("Staff Pick 8")).toBeInTheDocument();
      expect(screen.getByText("Staff Pick 9")).toBeInTheDocument();
    });
  });

  test("renders 'No books available' when categories are empty", async () => {
    getLocalWishlistItems.mockReturnValue([]);
    // Mock empty API responses
    getNewBooks.mockResolvedValue([]);
    getBestSellingBooks.mockResolvedValue([]);
    getBookDetailsById.mockResolvedValue(null);

    render(
      <MemoryRouter>
        <MainContent />
      </MemoryRouter>
    );

    // Wait for empty states
    await waitFor(() => {
      expect(screen.getAllByText("No books available").length).toBe(3); // One for each category
    });
  });

  test("handles API errors gracefully", async () => {
    getLocalWishlistItems.mockReturnValue([]);
    // Mock API errors
    getNewBooks.mockRejectedValue(new Error("Failed to fetch new books"));
    getBestSellingBooks.mockRejectedValue(new Error("Failed to fetch bestsellers"));
    getBookDetailsById.mockRejectedValue(new Error("Failed to fetch staff picks"));

    render(
      <MemoryRouter>
        <MainContent />
      </MemoryRouter>
    );

    // Wait for error handling
    await waitFor(() => {
      // The categories should still render even if there are errors
      expect(screen.getByText("New Releases")).toBeInTheDocument();
      expect(screen.getByText("Bestsellers")).toBeInTheDocument();
      expect(screen.getByText("Staff Picks")).toBeInTheDocument();
      // Error handling should result in no books being displayed
      expect(screen.getAllByText("No books available").length).toBe(3);
    });
  });
});

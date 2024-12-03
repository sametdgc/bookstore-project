import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "../components/common/NavBar/SearchBar";
import { searchBooks } from "../services/api"; // Import searchBooks for mocking

// Mock the API call and React Router's useNavigate
jest.mock("../services/api", () => ({
  searchBooks: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(), // Mock useNavigate as a Jest function
}));

import { useNavigate } from "react-router-dom";

describe("SearchBar Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn(); // Initialize mockNavigate as a Jest function
    useNavigate.mockReturnValue(mockNavigate); // Mock useNavigate to return mockNavigate
    searchBooks.mockClear(); // Clear any previous calls to searchBooks
  });

  test("searches for a book by name", async () => {
    const mockResults = [{ book_id: 1, title: "The Great Gatsby", author: { author_name: "F. Scott Fitzgerald" } }];
    searchBooks.mockResolvedValueOnce(mockResults);

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search for books, categories, authors...");
    fireEvent.change(input, { target: { value: "The Great Gatsby" } });

    await waitFor(() => {
      expect(searchBooks).toHaveBeenCalledWith("The Great Gatsby");
      const result = screen.getByText("The Great Gatsby");
      expect(result).toBeInTheDocument();
    });
  });

  test("searches for a book by author name", async () => {
    const mockResults = [{ book_id: 1, title: "The Great Gatsby", author: { author_name: "F. Scott Fitzgerald" } }];
    searchBooks.mockResolvedValueOnce(mockResults);

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search for books, categories, authors...");
    fireEvent.change(input, { target: { value: "F. Scott Fitzgerald" } });

    await waitFor(() => {
      expect(searchBooks).toHaveBeenCalledWith("F. Scott Fitzgerald");
      const result = screen.getByText("The Great Gatsby");
      expect(result).toBeInTheDocument();
    });
  });

  test("searches for a book by description", async () => {
    const mockResults = [
      { book_id: 1, title: "The Great Gatsby", author: { author_name: "F. Scott Fitzgerald" }, description: "A classic novel of the Jazz Age." },
    ];
    searchBooks.mockResolvedValueOnce(mockResults);

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search for books, categories, authors...");
    fireEvent.change(input, { target: { value: "Jazz Age" } });

    await waitFor(() => {
      expect(searchBooks).toHaveBeenCalledWith("Jazz Age");
      const result = screen.getByText("The Great Gatsby");
      expect(result).toBeInTheDocument();
    });
  });

  test("searches for a book by ISBN", async () => {
    const mockResults = [
      { book_id: 1, title: "The Great Gatsby", author: { author_name: "F. Scott Fitzgerald" }, isbn: "978-0743273565" },
    ];
    searchBooks.mockResolvedValueOnce(mockResults);

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search for books, categories, authors...");
    fireEvent.change(input, { target: { value: "978-0743273565" } });

    await waitFor(() => {
      expect(searchBooks).toHaveBeenCalledWith("978-0743273565");
      const result = screen.getByText("The Great Gatsby");
      expect(result).toBeInTheDocument();
    });
  });

  test("searches for a book by publisher", async () => {
    const mockResults = [
      { book_id: 1, title: "The Great Gatsby", author: { author_name: "F. Scott Fitzgerald" }, publisher: "Scribner" },
    ];
    searchBooks.mockResolvedValueOnce(mockResults);

    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search for books, categories, authors...");
    fireEvent.change(input, { target: { value: "Scribner" } });

    await waitFor(() => {
      expect(searchBooks).toHaveBeenCalledWith("Scribner");
      const result = screen.getByText("The Great Gatsby");
      expect(result).toBeInTheDocument();
    });
  });
});

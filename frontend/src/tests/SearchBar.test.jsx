import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "../components/common/NavBar/SearchBar";
import { searchBooks } from "../services/api";

// Mock the API call
jest.mock("../services/api", () => ({
  searchBooks: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

import { useNavigate } from "react-router-dom";

describe("SearchBar Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    searchBooks.mockClear();
  });

  const mockResults = [
    {
      book_id: 1,
      title: "The Great Gatsby",
      author: { author_name: "F. Scott Fitzgerald" },
      price: 10.99, // Add valid price
      discount_rate: 0, // Add discount_rate for completeness
      image_url: "http://example.com/image.jpg",
    },
  ];

  test("searches for a book by name", async () => {
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
    const isbnResults = [
      {
        book_id: 1,
        title: "The Great Gatsby",
        author: { author_name: "F. Scott Fitzgerald" },
        price: 10.99,
        discount_rate: 0,
        image_url: "http://example.com/image.jpg",
        isbn: "978-0743273565",
      },
    ];
    searchBooks.mockResolvedValueOnce(isbnResults);

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
    const publisherResults = [
      {
        book_id: 1,
        title: "The Great Gatsby",
        author: { author_name: "F. Scott Fitzgerald" },
        price: 10.99,
        discount_rate: 0,
        image_url: "http://example.com/image.jpg",
        publisher: "Scribner",
      },
    ];
    searchBooks.mockResolvedValueOnce(publisherResults);

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

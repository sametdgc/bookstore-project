import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchFilter from "../components/SearchFilter";

describe("SearchFilter Component", () => {
  let mockOnFilterChange;
  let mockOnSortChange;
  let mockOnCollapseChange;

  beforeEach(() => {
    mockOnFilterChange = jest.fn();
    mockOnSortChange = jest.fn();
    mockOnCollapseChange = jest.fn();

    render(
      <SearchFilter
        onFilterChange={mockOnFilterChange}
        onSortChange={mockOnSortChange}
        onCollapseChange={mockOnCollapseChange}
        genreCounts={{ 1: 10, 2: 5 }}
        languageCounts={{ 1: 20, 2: 15 }}
        authorCounts={{ 1: 8, 2: 3 }}
        authors={[
          { author_id: 1, author_name: "Author A" },
          { author_id: 2, author_name: "Author B" },
        ]}
        initialFilters={{
          genre_ids: [1],
          language_ids: [1],
          author_ids: [],
          minPrice: 10,
          maxPrice: 50,
        }}
      />
    );
  });

  test("handles sorting", () => {
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "price-desc" } });
    expect(mockOnSortChange).toHaveBeenCalledWith("price-desc");
  });

  test("toggles collapse state", () => {
    const collapseButton = screen.getByRole("button", { name: /☰/i });
    fireEvent.click(collapseButton);
    expect(mockOnCollapseChange).toHaveBeenCalledWith(true);

    fireEvent.click(collapseButton); // Toggle back
    expect(mockOnCollapseChange).toHaveBeenCalledWith(false);
  });

  test("applies filters on button click", () => {
    const applyButton = screen.getByRole("button", { name: /Apply Filters/i });
    fireEvent.click(applyButton);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });
});

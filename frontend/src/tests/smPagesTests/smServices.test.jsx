import { getAllInvoices, getRevenueByCategory,getRefundRequests,  approveRefund } from "../../services/api/smServices";
import { supabase } from "../../services/supabaseClient";

jest.mock("../../services/supabaseClient");

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Sales Manager Services Tests", () => {
  describe("getAllInvoices", () => {
    it("should return invoices when data is available", async () => {
      const mockData = [
        {
          order_id: 1,
          order_date: "2023-01-01",
          total_price: 100,
          users: { full_name: "John Doe", email: "john@example.com" },
          addresses: { city: "City A", zip_code: "12345" },
          orderitems: [
            {
              book_id: 1,
              quantity: 2,
              item_price: 50,
              books: { title: "Book A" },
            },
          ],
        },
      ];

      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await getAllInvoices();
      expect(result).toEqual(mockData);
      expect(supabase.from).toHaveBeenCalledWith("orders");
    });

    it("should return an empty array when an error occurs", async () => {
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Some error" }, // Hata mesajını buraya ekledik
        }),
      });

      const result = await getAllInvoices();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error fetching invoices:", "Some error");
    });
  });

  describe("getRevenueByCategory", () => {
    it("should calculate revenue by category", async () => {
      const mockData = [
        {
          quantity: 2,
          item_price: 50,
          books: { genres: { genre_name: "Fiction" } },
        },
        {
          quantity: 3,
          item_price: 30,
          books: { genres: { genre_name: "Non-Fiction" } },
        },
      ];

      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await getRevenueByCategory();
      expect(result).toEqual([
        { category: "Fiction", revenue: 100 },
        { category: "Non-Fiction", revenue: 90 },
      ]);
    });

    it("should return an empty array when an error occurs", async () => {
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Error fetching" },
        }),
      });

      const result = await getRevenueByCategory();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching revenue by category:",
        "Error fetching"
      );
    });
  });
  describe("Refund Services", () => {
    describe("getRefundRequests", () => {
      it("should fetch all refund requests successfully", async () => {
        const mockData = [
          {
            id: 1,
            order_id: 123,
            book_id: 456,
            quantity: 2,
            item_price: 29.99,
            reason: "Damaged",
            return_status: "pending",
            request_date: "2024-01-01",
            books: { title: "Test Book", stock: 10 },
            users: { full_name: "John Doe", email: "john@example.com" },
          },
        ];
  
        supabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        });
  
        const result = await getRefundRequests();
        expect(result).toEqual({ data: mockData, error: null });
        expect(supabase.from).toHaveBeenCalledWith("returns");
      });
    });

  });
});

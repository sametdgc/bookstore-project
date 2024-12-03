import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { supabase } from "../services/supabaseClient";
import { testSupabaseConnection, syncLocalCartToDatabase, getLocalCartItems, getUserRoleById } from "../services/api";
import Cookies from "js-cookie";

jest.mock("../services/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock("../services/api", () => ({
  testSupabaseConnection: jest.fn(),
  syncLocalCartToDatabase: jest.fn(),
  getLocalCartItems: jest.fn().mockReturnValue([]),
  getUserRoleById: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

import { useNavigate } from "react-router-dom";

describe("LoginForm Component", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks(); // Clear all mocks before each test
  });

  test("renders email and password input fields", () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("navigates to the correct dashboard based on user role", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: { user_metadata: { custom_incremented_id: 1 } } },
    });

    getUserRoleById.mockResolvedValue({ role_name: "Product Manager" });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "manager@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith("user_id", 1, { expires: 7 });
      expect(mockNavigate).toHaveBeenCalledWith("/pm-dashboard");
    });
  });

  test("syncs local cart for customers and navigates to shopping cart", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: { user_metadata: { custom_incremented_id: 2 } } },
    });

    getUserRoleById.mockResolvedValue({ role_name: "Customer" });
    syncLocalCartToDatabase.mockResolvedValueOnce();
    getLocalCartItems.mockReturnValue([{ id: 1, quantity: 2 }]);

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "customer@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith("user_id", 2, { expires: 7 });
      expect(syncLocalCartToDatabase).toHaveBeenCalledWith([{ id: 1, quantity: 2 }], 2);
      expect(mockNavigate).toHaveBeenCalledWith("/shopping-cart");
    });
  });

  test("handles unexpected errors", async () => {
    supabase.auth.signInWithPassword.mockRejectedValue(new Error("Unexpected error"));

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "error@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument()
    );
  });
});

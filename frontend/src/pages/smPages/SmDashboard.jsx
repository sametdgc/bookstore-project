import React, { useEffect, useState } from "react";
import PriceManager from "./sections/priceManager";
import InvoiceManager from "./sections/invoiceManager";
import RevenueManager from "./sections/revenueManager";
import RefundManager from "./sections/refundManager";
import BulkDiscountUpdate from "./sections/bulkDiscountManager";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

const SMDashboard = () => {
  const [activeSection, setActiveSection] = useState("invoice");
  const navigate = useNavigate();

  // Sidebar navigation links
  const sidebarLinks = [
    { id: "invoice", label: "Oversee Invoices" },
    { id: "price", label: "Manage Prices" },
    { id: "revenue", label: "Revenue Management" },
    { id: "refund", label: "Refund Management" },
    { id: "bulkDiscount", label: "Bulk Discount Update" },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error.message);
      } else {
        navigate("/login"); // Navigate to login page
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#65aa92] text-white p-4 fixed h-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sales Manager Dashboard
        </h1>
        <nav className="space-y-4">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                activeSection === link.id
                  ? "bg-white text-[#65aa92] font-semibold"
                  : "hover:bg-[#4a886e]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-6 overflow-auto">
        {activeSection === "invoice" && <InvoiceManager />}
        {activeSection === "price" && <PriceManager />}
        {activeSection === "revenue" && <RevenueManager />}
        {activeSection === "refund" && <RefundManager />}
        {activeSection === "bulkDiscount" && <BulkDiscountUpdate />}
      </main>
    </div>
  );
};

export default SMDashboard;

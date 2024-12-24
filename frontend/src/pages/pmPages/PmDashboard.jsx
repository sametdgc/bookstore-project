import React, { useState } from "react";
import ProductManagement from "./sections/ProductManagement";
import CommentApproval from "./sections/CommentApproval";
import StockManagement from "./sections/StockManagement";
import DeliveryDetails from "./sections/DeliveryDetails";
import DeleteByGenrePage from "./sections/DeleteByGenrePage"; // Import the new page
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

const PMDashboard = () => {
  const [activeSection, setActiveSection] = useState("products");
  const navigate = useNavigate();

  // Sidebar navigation links
  const sidebarLinks = [
    { id: "products", label: "Manage Products" },
    { id: "comments", label: "Approve Comments" },
    { id: "stock", label: "Stock Management" },
    { id: "deliveries", label: "Delivery Details" },
    { id: "deleteByGenre", label: "Delete by Genre" }, // Added this
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#65aa92] text-white p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Product Manager Dashboard</h1>
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
      <main className="flex-grow p-6">
        {activeSection === "products" && <ProductManagement />}
        {activeSection === "comments" && <CommentApproval />}
        {activeSection === "stock" && <StockManagement />}
        {activeSection === "deliveries" && <DeliveryDetails />}
        {activeSection === "deleteByGenre" && <DeleteByGenrePage />} {/* New */}
      </main>
    </div>
  );
};

export default PMDashboard;

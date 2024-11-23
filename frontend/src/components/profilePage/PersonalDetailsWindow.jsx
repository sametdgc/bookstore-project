import React, { useState } from "react";

const PersonalDetailsWindow = ({ userData, userEmail, onSaveChanges, onCancel, onEditToggle, isEditing }) => {
  const [editData, setEditData] = useState({
    full_name: userData?.full_name || "",
    phone_number: userData?.phone_number || "",
    tax_id: userData?.tax_id || "",
    email: userEmail || "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "full_name") {
      const sanitized = value.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ");
      setEditData({ ...editData, [name]: sanitized });
    } else if (name === "phone_number" || name === "tax_id") {
      const sanitized = value.replace(/\D/g, "");
      setEditData({ ...editData, [name]: sanitized });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSaveChanges = async () => {
    setError("");
    setSuccessMessage("");

    if (!editData.full_name.trim() || !editData.phone_number.trim() || !editData.tax_id.trim()) {
      setError("All fields must be filled.");
      return;
    }

    if (editData.phone_number.length < 6 || editData.phone_number.length > 15) {
      setError("Phone number must be between 6 and 15 digits.");
      return;
    }

    if (editData.tax_id.length < 4 || editData.tax_id.length > 10) {
      setError("Tax ID must be between 4 and 10 digits.");
      return;
    }

    try {
      await onSaveChanges(editData); // Pass data to parent component for saving
      setSuccessMessage("Your changes have been saved successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setError("An error occurred while saving changes.");
    }
  };

  const handleCancel = () => {
    // Reset editData to original userData
    setEditData({
      full_name: userData?.full_name || "",
      phone_number: userData?.phone_number || "",
      tax_id: userData?.tax_id || "",
      email: userEmail || "",
    });
    setError(""); // Clear error messages
    onCancel(); // Notify parent component
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 relative">
      {/* Success message box */}
      {successMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#65aa92] text-white p-2 rounded-lg shadow-md z-10">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#65aa92]">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={onEditToggle}
            className="bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e] transition"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-[150px_1fr] gap-6 items-center">
          <label className="text-gray-700 font-semibold text-right">Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={editData.full_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          <label className="text-gray-700 font-semibold text-right">Email:</label>
          <input
            type="email"
            name="email"
            value={editData.email}
            readOnly
            className="w-full p-2 border bg-gray-100 text-gray-500 rounded"
          />
          <label className="text-gray-700 font-semibold text-right">Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            value={editData.phone_number}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
          <label className="text-gray-700 font-semibold text-right">Tax ID:</label>
          <input
            type="text"
            name="tax_id"
            value={editData.tax_id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          />
        </div>
      ) : (
        <div className="grid grid-cols-[150px_1fr] gap-6 items-center">
          <label className="text-gray-700 font-semibold text-right">Full Name:</label>
          <p className="text-gray-700">{userData?.full_name || "N/A"}</p>
          <label className="text-gray-700 font-semibold text-right">Email:</label>
          <p className="text-gray-700">{userEmail || "N/A"}</p>
          <label className="text-gray-700 font-semibold text-right">Phone Number:</label>
          <p className="text-gray-700">{userData?.phone_number || "N/A"}</p>
          <label className="text-gray-700 font-semibold text-right">Tax ID:</label>
          <p className="text-gray-700">{userData?.tax_id || "N/A"}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-m text-center mt-4">{error}</p>}

      {isEditing && (
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleSaveChanges}
            className="bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e] transition"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsWindow;

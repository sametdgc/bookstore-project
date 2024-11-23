import React, { useState, useEffect } from "react";
import {
  addNewAddress,
  getUserAddresses,
  updateAddressDetails,
  deleteAddress,
} from "../../services/api";
import { FaTrash, FaEdit } from "react-icons/fa";

const AddressesWindow = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    city: "",
    district: "",
    address_details: "",
    address_title: "",
  });
  const [editMode, setEditMode] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [notification, setNotification] = useState(null); // Global notification

  // Helper to show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    const addressData = await getUserAddresses();
    setAddresses(addressData);
  };

  // Handle form input changes
  const handleAddressChange = (e, isEditing = false) => {
    const { name, value } = e.target;

    if (isEditing) {
      setEditAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle adding a new address
  const handleAddAddress = async () => {
    if (
      !newAddress.city.trim() ||
      !newAddress.district.trim() ||
      !newAddress.address_details.trim() ||
      !newAddress.address_title.trim()
    ) {
      setErrorMessages({ new: "All fields must be filled." });
      return;
    }

    const result = await addNewAddress(userId, newAddress);

    if (result.success) {
      showNotification("Address added successfully!");
      fetchAddresses();
      setNewAddress({
        city: "",
        district: "",
        address_details: "",
        address_title: "",
      });
      setShowAddressForm(false);
      setErrorMessages({});
    } else {
      showNotification("Failed to add address. Please try again.", "error");
    }
  };

  // Handle editing an address
  const handleEditAddress = (address) => {
    setEditMode(address.address_id);
    setEditAddress({
      address_id: address.address_id,
      address_title: address.address_title,
      city: address.address.city,
      district: address.address.district,
      address_details: address.address.address_details,
    });
    setErrorMessages({});
  };

  // Handle saving updated address details
  const handleSaveEdit = async () => {
    if (
      !editAddress.city.trim() ||
      !editAddress.district.trim() ||
      !editAddress.address_details.trim() ||
      !editAddress.address_title.trim()
    ) {
      setErrorMessages({
        [editAddress.address_id]: "All fields must be filled.",
      });
      return;
    }

    const result = await updateAddressDetails(
      userId,
      editAddress.address_id,
      editAddress
    );

    if (result.success) {
      showNotification("Address updated successfully!");
      fetchAddresses();
      setEditMode(null);
      setErrorMessages({});
    } else {
      showNotification("Failed to update address. Please try again.", "error");
    }
  };

  // Handle delete address with confirmation
  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    const result = await deleteAddress(addressId);

    if (result.success) {
      showNotification("Address deleted successfully!");
      fetchAddresses();
    } else {
      showNotification("Failed to delete address. Please try again.", "error");
    }
  };

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 relative">
      {/* Notification Box */}
      {notification && (
        <div
          className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md text-white ${
            notification.type === "success" ? "bg-[#65aa92]" : "bg-red-500"
          }`}
          style={{ zIndex: 100 }}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#65aa92]">
          Saved Addresses
        </h2>
        {!showAddressForm && (
          <button
            onClick={() => setShowAddressForm(true)}
            className="bg-[#65aa92] text-white px-4 py-2 rounded hover:bg-[#4a886e] transition"
          >
            Add Address
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.length > 0 ? (
          addresses.map((address) =>
            editMode === address.address_id ? (
              <div
                key={address.address_id}
                className="p-4 border rounded-md bg-gray-50 shadow-sm flex flex-col space-y-2"
              >
                <label className="font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  name="address_title"
                  value={editAddress.address_title}
                  onChange={(e) => handleAddressChange(e, true)}
                  className="p-2 border rounded-md"
                />
                <label className="font-semibold text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={editAddress.city}
                  onChange={(e) => handleAddressChange(e, true)}
                  className="p-2 border rounded-md"
                />
                <label className="font-semibold text-gray-700">District</label>
                <input
                  type="text"
                  name="district"
                  value={editAddress.district}
                  onChange={(e) => handleAddressChange(e, true)}
                  className="p-2 border rounded-md"
                />
                <label className="font-semibold text-gray-700">Details</label>
                <textarea
                  name="address_details"
                  value={editAddress.address_details}
                  onChange={(e) => handleAddressChange(e, true)}
                  className="p-2 border rounded-md"
                ></textarea>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-[#65aa92] text-white px-4 py-2 rounded-md hover:bg-[#4a886e] transition flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(null);
                      setErrorMessages((prev) => {
                        const updatedErrors = { ...prev };
                        delete updatedErrors[editAddress.address_id];
                        return updatedErrors;
                      });
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition flex-1"
                  >
                    Cancel
                  </button>
                </div>
                {errorMessages[editAddress.address_id] && (
                  <p className="text-red-500 text-base mt-2">
                    {errorMessages[editAddress.address_id]}
                  </p>
                )}
              </div>
            ) : (
              <div
                key={address.address_id}
                className="p-4 border rounded-md bg-gray-50 shadow-sm grid grid-cols-10"
              >
                <div className="col-span-8">
                  <h3 className="text-xl font-semibold text-[#65aa92] mb-2">
                    {address.address_title}
                  </h3>
                  <p className="text-gray-700">
                    <strong>City:</strong> {address.address.city}
                  </p>
                  <p className="text-gray-700">
                    <strong>District:</strong> {address.address.district}
                  </p>
                  <p className="text-gray-700">
                    <strong>Details:</strong> {address.address.address_details}
                  </p>
                </div>
                <div className="col-span-2 flex flex-col items-center">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="bg-[#65aa92] text-white p-3 rounded-full hover:[#4a886e] transition mb-4"
                    title="Edit Address"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.address_id)}
                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition"
                    title="Delete Address"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <div className="col-span-full text-left text-gray-500">
            <p>No saved address.</p>
          </div>
        )}

        {showAddressForm && (
          <div className="p-4 border rounded-md bg-gray-50 shadow-sm col-span-full lg:col-span-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="address_title"
                  value={newAddress.address_title}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter address title (e.g., Home)"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={newAddress.district}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter district"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-semibold text-gray-700 mb-1">
                Address Details
              </label>
              <textarea
                name="address_details"
                value={newAddress.address_details}
                onChange={handleAddressChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter address details"
                rows={3}
              ></textarea>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleAddAddress}
                className="bg-[#65aa92] text-white px-4 py-2 rounded-md hover:bg-[#4a886e] transition"
              >
                Save Address
              </button>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setErrorMessages((prev) => {
                    const updatedErrors = { ...prev };
                    delete updatedErrors.new;
                    return updatedErrors;
                  });
                  setNewAddress({
                    city: "",
                    district: "",
                    address_details: "",
                    address_title: "",
                  });
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
            {errorMessages.new && (
              <p className="text-red-500 text-base mt-2">{errorMessages.new}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesWindow;

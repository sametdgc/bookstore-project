import React, { useState, useEffect } from "react";
import {
  addNewAddress,
  getUserAddresses,
  updateAddressDetails,
  deleteAddress,
} from "../../services/api";
import { Trash2, Edit2, PlusCircle, X, AlertCircle } from "lucide-react";

const AddressesWindow = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    city: "",
    district: "",
    address_details: "",
    address_title: "",
    zip_code: "",
  });
  const [editMode, setEditMode] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAddresses = async () => {
    const addressData = await getUserAddresses();
    setAddresses(addressData);
  };

  const handleAddressChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.city.trim() ||
      !newAddress.district.trim() ||
      !newAddress.address_details.trim() ||
      !newAddress.address_title.trim() ||
      !newAddress.zip_code.trim()
    ) {
      setErrorMessages({ new: "All fields must be filled." });
      return;
    }

    const addressToAdd = {
      ...newAddress,
      address: {
        city: newAddress.city,
        district: newAddress.district,
        address_details: newAddress.address_details,
        zip_code: newAddress.zip_code,
      },
    };

    const result = await addNewAddress(userId, addressToAdd);

    if (result.success) {
      showNotification("Address added successfully!");
      fetchAddresses();
      setNewAddress({
        city: "",
        district: "",
        address_details: "",
        address_title: "",
        zip_code: "",
      });
      setShowAddressForm(false);
      setErrorMessages({});
    } else {
      showNotification("Failed to add address. Please try again.", "error");
    }
  };

  const handleEditAddress = (address) => {
    setEditMode(address.address_id);
    setEditAddress({
      address_id: address.address_id,
      address_title: address.address_title,
      city: address.address.city,
      district: address.address.district,
      address_details: address.address.address_details,
      zip_code: address.address.zip_code,
    });
    setErrorMessages({});
  };

  const handleSaveEdit = async () => {
    if (
      !editAddress.city.trim() ||
      !editAddress.district.trim() ||
      !editAddress.address_details.trim() ||
      !editAddress.address_title.trim() ||
      !editAddress.zip_code.trim()
    ) {
      setErrorMessages({
        [editAddress.address_id]: "All fields must be filled.",
      });
      return;
    }

    const addressToUpdate = {
      ...editAddress,
      address: {
        city: editAddress.city,
        district: editAddress.district,
        address_details: editAddress.address_details,
        zip_code: editAddress.zip_code,
      },
    };

    const result = await updateAddressDetails(
      userId,
      editAddress.address_id,
      addressToUpdate
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

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-4xl mx-auto">
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } transition-opacity duration-300 ease-in-out z-50 flex items-center`}
        >
          <AlertCircle className="mr-2" />
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Addresses</h2>
        {!showAddressForm && (
          <button
            onClick={() => setShowAddressForm(true)}
            className="bg-[#65aa92] text-white px-4 py-2 rounded-full hover:bg-[#4a886e] transition duration-300 ease-in-out flex items-center"
          >
            <PlusCircle className="mr-2" size={20} />
            Add Address
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addresses.length > 0 ? (
          addresses.map((address) =>
            editMode === address.address_id ? (
              <div
                key={address.address_id}
                className="bg-gray-50 rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Edit Address
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="edit-title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      name="address_title"
                      value={editAddress.address_title}
                      onChange={(e) => handleAddressChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      id="edit-city"
                      type="text"
                      name="city"
                      value={editAddress.city}
                      onChange={(e) => handleAddressChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      District
                    </label>
                    <input
                      id="edit-district"
                      type="text"
                      name="district"
                      value={editAddress.district}
                      onChange={(e) => handleAddressChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </label>
                    <input
                      id="edit-zip"
                      type="text"
                      name="zip_code"
                      value={editAddress.zip_code}
                      onChange={(e) => handleAddressChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-details"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Details
                    </label>
                    <textarea
                      id="edit-details"
                      name="address_details"
                      value={editAddress.address_details}
                      onChange={(e) => handleAddressChange(e, true)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(null);
                        setErrorMessages((prev) => {
                          const updatedErrors = { ...prev };
                          delete updatedErrors[editAddress.address_id];
                          return updatedErrors;
                        });
                      }}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                {errorMessages[editAddress.address_id] && (
                  <p className="text-red-500 text-sm mt-2">
                    {errorMessages[editAddress.address_id]}
                  </p>
                )}
              </div>
            ) : (
              <div
                key={address.address_id}
                className="bg-white rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {address.address_title}
                </h3>
                <p className="text-gray-600 mb-1">
                  {address.address.city}, {address.address.district}
                </p>
                <p className="text-gray-600 mb-1">{address.address.zip_code}</p>
                <p className="text-gray-600 mb-4">
                  {address.address.address_details}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                    title="Edit Address"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.address_id)}
                    className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                    title="Delete Address"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            <p className="text-xl">No saved addresses yet.</p>
            <p className="mt-2">Add a new address to get started!</p>
          </div>
        )}
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Address
              </h3>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setErrorMessages({});
                  setNewAddress({
                    city: "",
                    district: "",
                    address_details: "",
                    address_title: "",
                    zip_code: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddAddress();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="new-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="new-title"
                  type="text"
                  name="address_title"
                  value={newAddress.address_title}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="e.g., Home, Work"
                />
              </div>
              <div>
                <label
                  htmlFor="new-city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="new-city"
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label
                  htmlFor="new-district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  id="new-district"
                  type="text"
                  name="district"
                  value={newAddress.district}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter district"
                />
              </div>
              <div>
                <label
                  htmlFor="new-zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP Code
                </label>
                <input
                  id="new-zip"
                  type="text"
                  name="zip_code"
                  value={newAddress.zip_code}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter ZIP code"
                />
              </div>
              <div>
                <label
                  htmlFor="new-details"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Details
                </label>
                <textarea
                  id="new-details"
                  name="address_details"
                  value={newAddress.address_details}
                  onChange={handleAddressChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter full address details"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  Add Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setErrorMessages({});
                    setNewAddress({
                      city: "",
                      district: "",
                      address_details: "",
                      address_title: "",
                      zip_code: "",
                    });
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
            {errorMessages.new && (
              <p className="text-red-500 text-sm mt-2">{errorMessages.new}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesWindow;

import React, { useState, useEffect } from "react";
import { addNewAddress, getUserAddresses, deleteAddress } from "../../services/api";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";

const AddressSelector = ({ userId, onAddressSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_title: "",
    address_details: "",
    city: "",
    district: "",
    zip_code: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      const data = await getUserAddresses(userId);
      setAddresses(data || []);
    };

    fetchAddresses();
  }, [userId]);

  const handleAddAddress = async () => {
    if (
      !newAddress.address_title ||
      !newAddress.address_details ||
      !newAddress.city ||
      !newAddress.district ||
      !newAddress.zip_code
    ) {
      alert("Please fill in all fields");
      return;
    }

    const result = await addNewAddress(userId, {
      ...newAddress,
      address: {
        address_details: newAddress.address_details,
        city: newAddress.city,
        district: newAddress.district,
        zip_code: newAddress.zip_code,
      },
    });

    if (result.success) {
      const updatedAddresses = await getUserAddresses(userId);
      setAddresses(updatedAddresses || []);
      setShowAddAddressPopup(false);
      setNewAddress({
        address_title: "",
        address_details: "",
        city: "",
        district: "",
        zip_code: "",
      });
    } else {
      alert("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    const result = await deleteAddress(addressId);

    if (result.success) {
      const updatedAddresses = await getUserAddresses(userId);
      setAddresses(updatedAddresses || []);
    } else {
      alert("Failed to delete address. Please try again.");
    }
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    onAddressSelect(addressId);
  };

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer"
          onClick={() => setShowAddAddressPopup(true)}
        >
          <PlusCircle className="text-[#65aa92] mr-2" size={24} />
          <span className="text-gray-700"> Add a new address</span>
        </div>
        {addresses.map((address) => (
          <div
            key={address.address_id}
            className={`border-2 rounded-lg p-4 ${
              selectedAddressId === address.address_id
                ? "border-[#65aa92] bg-green-50"
                : "border-gray-300"
            } cursor-pointer hover:shadow-md`}
            onClick={() => handleAddressSelect(address.address_id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                {address.address_title}
              </h3>
              <div className="flex space-x-2">
                <Edit2
                  size={16}
                  className="text-blue-500 cursor-pointer"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Edit functionality not implemented in this demo.");
                  }}
                />
                <Trash2
                  size={16}
                  className="text-red-500 cursor-pointer"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.address_id);
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-700">{address.address.address_details}</p>
            <p className="text-sm text-gray-700">
              {address.address.district}, {address.address.city}
            </p>
            <p className="text-sm text-gray-700">ZIP: {address.address.zip_code}</p>
          </div>
        ))}
      </div>

      {showAddAddressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="address_title"
                  value={newAddress.address_title}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address_title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address Details
                </label>
                <textarea
                  name="address_details"
                  rows={3}
                  value={newAddress.address_details}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      address_details: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={newAddress.district}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, district: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={newAddress.zip_code}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip_code: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowAddAddressPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-[#65aa92] text-white px-4 py-2 rounded"
                  onClick={handleAddAddress}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;

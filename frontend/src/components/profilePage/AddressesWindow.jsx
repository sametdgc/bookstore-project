import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { getUserAddresses } from "../../services/api";

const AddressesWindow = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false); // Show/Hide address form
  const [newAddress, setNewAddress] = useState({ city: "", district: "", address_details: "", address_title: "" }); // New address form data

  // Fetch addresses (you can call this after adding a new address)
  const fetchAddresses = async () => {
    const addressData = await getUserAddresses();
    setAddresses(addressData);
  };

  // Handle form input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new address
  const handleAddAddress = async () => {
    try {
      // Step 1: Add the new address to the `addresses` table
      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .insert([
          {
            city: newAddress.city,
            district: newAddress.district,
            address_details: newAddress.address_details,
          },
        ])
        .select()
        .single(); // Get the inserted address
  
      if (addressError) throw addressError;
  
      // Step 2: Link the new address to the user in the `useraddresses` table with the address_title
      const { error: userAddressError } = await supabase
        .from("useraddresses")
        .insert([
          {
            user_id: userId,
            address_id: addressData.address_id,
            address_title: newAddress.address_title, // Save the title to the useraddresses table
          },
        ]);
  
      if (userAddressError) throw userAddressError;
  
      // Step 3: Refresh the address list
      fetchAddresses();
  
      // Reset the form
      setNewAddress({ city: "", district: "", address_details: "", address_title: "" });
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error adding new address:", error.message);
    }
  };  

  // Initial load of addresses
  React.useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Saved Addresses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render all address boxes */}
        {addresses.length > 0 &&
          addresses.map((ua, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50 shadow-sm">
              <h3 className="text-xl font-semibold text-[#65aa92] mb-2">{ua.address_title}</h3>
              <p className="text-gray-700"><strong>City:</strong> {ua.address.city}</p>
              <p className="text-gray-700"><strong>District:</strong> {ua.address.district}</p>
              <p className="text-gray-700"><strong>Details:</strong> {ua.address.address_details}</p>
            </div>
          ))}

        {/* Add New Address Button */}
        <div
          className={`p-4 border rounded-md bg-gray-50 shadow-sm flex items-center justify-center ${
            showAddressForm ? "col-span-full lg:col-span-1" : ""
          }`}
          style={{ minHeight: "150px" }}
        >
          {!showAddressForm ? (
            <button
              onClick={() => setShowAddressForm(true)}
              className="bg-[#65aa92] text-white px-4 py-2 rounded-md w-full h-full flex items-center justify-center"
            >
              Add a New Address
            </button>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Title</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
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
                  <label className="block font-semibold text-gray-700 mb-1">District</label>
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
                <label className="block font-semibold text-gray-700 mb-1">Address Details</label>
                <textarea
                  name="address_details"
                  value={newAddress.address_details}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter address details"
                ></textarea>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleAddAddress}
                  className="bg-[#65aa92] text-white px-4 py-2 rounded-md"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesWindow;

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SavedAddressesDropdown = ({
  savedAddresses,
  showSavedAddresses,
  onToggle,
  onSelect,
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full p-2 bg-[#65aa92] text-white rounded flex justify-between items-center"
      >
        <span>Select from saved addresses</span>
        {showSavedAddresses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {showSavedAddresses && (
        <div className="mt-2 bg-white border border-gray-200 rounded shadow-lg">
          {savedAddresses.map((address) => (
            <div
              key={address.address_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(address)}
            >
              <p className="font-semibold">{address.address_title}</p>
              <p>
                {address.address.address_details}, {address.address.district}
              </p>
              <p>
                {address.address.city}, {address.address.zip_code}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAddressesDropdown;

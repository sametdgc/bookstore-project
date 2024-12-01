import React from "react";

const DeliveryAddressForm = ({ deliveryAddress, errors, onInputChange }) => {
  return (
    <div className="space-y-4 mb-8">
      {["address", "district", "city", "zip", "email"].map((field) => (
        <div key={field}>
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={deliveryAddress[field]}
            onChange={(e) => onInputChange(e)}
            className={`w-full p-2 border rounded ${
              errors[field] ? "border-red-500" : ""
            } focus:ring-[#65aa92] focus:ring-2 focus:outline-none`}
            required
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeliveryAddressForm;

import React from "react";

const PaymentForm = ({ cardDetails, errors, onInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number (16 digits)"
          value={cardDetails.cardNumber}
          onChange={onInputChange}
          className={`w-full p-2 border rounded ${
            errors.cardNumber ? "border-red-500" : ""
          } focus:ring-[#65aa92] focus:ring-2 focus:outline-none`}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
        )}
      </div>
      <div>
        <input
          type="text"
          name="cardholderName"
          placeholder="Cardholder Name"
          value={cardDetails.cardholderName}
          onChange={onInputChange}
          className={`w-full p-2 border rounded ${
            errors.cardholderName ? "border-red-500" : ""
          } focus:ring-[#65aa92] focus:ring-2 focus:outline-none`}
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
        )}
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/YY"
            value={cardDetails.expiryDate}
            onChange={onInputChange}
            className={`w-full p-2 border rounded ${
              errors.expiryDate ? "border-red-500" : ""
            } focus:ring-[#65aa92] focus:ring-2 focus:outline-none`}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
          )}
        </div>
        <div className="w-1/2">
          <input
            type="text"
            name="cvv"
            placeholder="CVV (3 digits)"
            value={cardDetails.cvv}
            onChange={onInputChange}
            className={`w-full p-2 border rounded ${
              errors.cvv ? "border-red-500" : ""
            } focus:ring-[#65aa92] focus:ring-2 focus:outline-none`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

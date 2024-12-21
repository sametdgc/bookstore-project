import React, { useState } from "react";
import { applyDiscountToBook, endAllActiveDiscounts } from "../../../services/api";

const BulkDiscountUpdate = () => {
  const [discountName, setDiscountName] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [endDate, setEndDate] = useState("");
  const [bookIds, setBookIds] = useState([""]); // Initialize with one empty field
  const [errors, setErrors] = useState({}); // Store validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Store success message

  const handleAddField = () => {
    setBookIds([...bookIds, ""]);
  };

  const handleRemoveField = (index) => {
    setBookIds(bookIds.filter((_, i) => i !== index));
  };

  const handleBookIdChange = (index, value) => {
    const updatedIds = [...bookIds];
    updatedIds[index] = value;
    setBookIds(updatedIds);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!discountName.trim()) {
      newErrors.discountName = "Discount name is required.";
    }

    if (discountRate <= 0 || discountRate >= 100) {
      newErrors.discountRate = "Discount rate must be greater than 0 and less than 100.";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required.";
    } else {
      const today = new Date();
      const selectedDate = new Date(endDate);
      if (selectedDate <= today) {
        newErrors.endDate = "End date must be later than today.";
      }
    }

    if (!bookIds.every((id) => id.trim())) {
      newErrors.bookIds = "All book ID fields must be filled.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const openConfirmationPopup = () => {
    if (validateInputs()) {
      setConfirmationPopup(true);
    }
  };

  const handleConfirmation = async (confirm) => {
    setConfirmationPopup(false);

    if (!confirm) return;

    setIsSubmitting(true);
    let successCount = 0;

    for (const bookId of bookIds) {
      try {
        await endAllActiveDiscounts(bookId);
        const { error } = await applyDiscountToBook(
          bookId,
          discountName,
          discountRate,
          endDate
        );
        if (!error) {
          successCount++;
        } else {
          setErrors({
            ...errors,
            form: `Failed to apply discount to Book ID ${bookId}: ${error}`,
          });
        }
      } catch (error) {
        setErrors({
          ...errors,
          form: `An error occurred for Book ID ${bookId}: ${error.message}`,
        });
      }
    }

    if (successCount > 0) {
      setSuccessMessage(`${successCount} discounts successfully applied!`);
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Bulk Discount Update</h1>
      {/* Discount Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Discount Name</label>
        <input
          type="text"
          className={`mt-1 w-full border ${
            errors.discountName ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm`}
          placeholder="Enter discount name"
          value={discountName}
          onChange={(e) => setDiscountName(e.target.value)}
        />
        {errors.discountName && (
          <p className="text-sm text-red-500 mt-1">{errors.discountName}</p>
        )}
      </div>

      {/* Discount Rate */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Discount Rate (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          className={`mt-1 w-full border ${
            errors.discountRate ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm`}
          placeholder="Enter discount rate"
          value={discountRate}
          onChange={(e) => setDiscountRate(Number(e.target.value))}
        />
        {errors.discountRate && (
          <p className="text-sm text-red-500 mt-1">{errors.discountRate}</p>
        )}
      </div>

      {/* End Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">End Date (Required)</label>
        <input
          type="date"
          className={`mt-1 w-full border ${
            errors.endDate ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm`}
          placeholder="Select end date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
      </div>

      {/* Book IDs */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Book IDs</label>
        {bookIds.map((bookId, index) => (
          <div key={index} className="flex items-center space-x-4 mt-2">
            <input
              type="text"
              className={`flex-1 border ${
                errors.bookIds ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
              placeholder={`Book ID #${index + 1}`}
              value={bookId}
              onChange={(e) => handleBookIdChange(index, e.target.value)}
            />
            {bookIds.length > 1 && (
              <button
                type="button"
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                onClick={() => handleRemoveField(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.bookIds && <p className="text-sm text-red-500 mt-1">{errors.bookIds}</p>}
        <button
          type="button"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleAddField}
        >
          Add Book ID Field
        </button>
      </div>

      {/* Submit Button */}
      <button
        className={`w-full px-4 py-2 rounded-md text-white ${
          isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={isSubmitting}
        onClick={openConfirmationPopup}
      >
        {isSubmitting ? "Applying Discounts..." : "Apply Bulk Discount"}
      </button>

      {/* Form-Level Error */}
      {errors.form && <p className="text-sm text-red-500 mt-4 text-center">{errors.form}</p>}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmationPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Bulk Update</h2>
            <p className="text-sm text-gray-600 mt-4">
              Applying a new discount will deactivate all currently active discounts for the specified books. Do you wish to continue?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => handleConfirmation(false)}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => handleConfirmation(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkDiscountUpdate;

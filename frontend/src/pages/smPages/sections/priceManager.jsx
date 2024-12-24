import React, { useEffect, useState } from "react";
import {
  getAllBooksRaw,
  updateBookPrice,
  applyDiscountToBook,
  getCurrentDiscount,
  endAllActiveDiscounts,
} from "../../../services/api";

const PriceManager = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    book: null,
  });
  const [errors, setErrors] = useState({}); // Store field-specific validation errors
  const [successMessage, setSuccessMessage] = useState(""); // Store success message

  // Fetch all books and discounts on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data } = await getAllBooksRaw();

      const booksWithDiscounts = await Promise.all(
        data.map(async (book) => {
          const { data: discountData } = await getCurrentDiscount(book.book_id);
          if (discountData === null) {
            return {
              ...book,
              newPrice: book.price,
              discount: 0,
              discountName: "No Active Discount",
              newDiscountName: "",
              newDiscountRate: 0,
              newDiscountEndDate: "",
            };
          } else {
            const currentDiscount = discountData || {
              discount_name: "None",
              discount_rate: 0,
            };
            return {
              ...book,
              newPrice: book.price,
              discount: currentDiscount.discount_rate,
              discountName: currentDiscount.discount_name,
              newDiscountName: "",
              newDiscountRate: 0,
              newDiscountEndDate: "",
            };
          }
        })
      );

      setBooks(booksWithDiscounts);
      setLoading(false);
    };

    fetchBooks();
  }, []);

  // Handle input changes and reset errors for the field
  const handleInputChange = (id, field, value) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.book_id === id ? { ...book, [field]: value } : book
      )
    );
    setErrors((prevErrors) => ({ ...prevErrors, [`${id}_${field}`]: null }));
  };

  // Validate if the end date is in the future
  const isEndDateValid = (endDate) => {
    if (!endDate) return "End date is required.";
    const today = new Date();
    const selectedDate = new Date(endDate);
    return selectedDate > today ? null : "End date must be later than today.";
  };

  // Validate all fields for a book
  const validateFields = (book) => {
    const newErrors = {};

    if (!book.newDiscountName.trim()) {
      newErrors[`${book.book_id}_newDiscountName`] = "Discount name is required.";
    }

    if (book.newDiscountRate <= 0 || book.newDiscountRate >= 100) {
      newErrors[`${book.book_id}_newDiscountRate`] =
        "Discount rate must be greater than 0 and less than 100.";
    }

    const endDateError = isEndDateValid(book.newDiscountEndDate);
    if (endDateError) {
      newErrors[`${book.book_id}_newDiscountEndDate`] = endDateError;
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Open confirmation pop-up
  const openConfirmationPopup = (book) => {
    if (validateFields(book)) {
      setConfirmation({ isOpen: true, book });
    }
  };

  // Handle confirmation actions
  const handleConfirmation = async (confirm) => {
    if (confirm && confirmation.book) {
      const { book } = confirmation;
      const { error: endDiscountError } = await endAllActiveDiscounts(book.book_id);
      if (endDiscountError) {
        alert(`Failed to end active discounts: ${endDiscountError}`);
        return;
      }

      const { error, message } = await applyDiscountToBook(
        book.book_id,
        book.newDiscountName,
        book.newDiscountRate,
        book.newDiscountEndDate || null
      );

      if (error) {
        alert(`Failed to apply discount: ${error}`);
      } else {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds  
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.book_id === book.book_id
              ? { ...b, discount: book.newDiscountRate, discountName: book.newDiscountName }
              : b
          )
        );
      }
    }

    setConfirmation({ isOpen: false, book: null });
  };

  // Update the base price of a book
  const saveBasePrice = async (id, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${id}_newPrice`]: "Base price must be a non-negative number.",
      }));
      return;
    }
  
    const { error } = await updateBookPrice(id, price);
    if (error) {
      alert(`Failed to update base price: ${error}`);
    } else {
      setSuccessMessage("Base price updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds  
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.book_id === id ? { ...book, price } : book
        )
      );
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Price Manager</h1>
      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : (
        <div className="space-y-6">
          {books.map((book) => (
            <div
              key={book.book_id}
              className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
            >
              {/* Book Details and Base Price Section */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-600">
                    Author: {book.author?.author_name}
                  </p>
                  <p className="text-sm text-gray-600">ID: {book.book_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    Current Price: ${book.price}
                  </p>
                  <input
                    type="number"
                    className={`mt-2 w-full border ${
                      errors[`${book.book_id}_newPrice`] ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                    value={book.newPrice}
                    onChange={(e) =>
                      handleInputChange(book.book_id, "newPrice", e.target.value)
                    }
                  />
                  {errors[`${book.book_id}_newPrice`] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[`${book.book_id}_newPrice`]}
                    </p>
                  )}
                </div>
                <div className="flex items-end">
                  <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => saveBasePrice(book.book_id, book.newPrice)}
                    disabled={parseFloat(book.newPrice) === book.price}
                  >
                    Update Base Price
                  </button>
                </div>
              </div>

              {/* Discount Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Discounts
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Current Active Discount */}
                  <div className="col-span-3 mb-4 p-4 bg-blue-50 border border-blue-300 rounded-md">
                    <p className="text-sm font-medium text-blue-700">
                      <strong>Active Discount:</strong> {book.discountName}
                    </p>
                    {book.discount > 0 ? (
                      <p className="text-sm text-blue-700">
                        <strong>Rate:</strong> {book.discount}% off
                      </p>
                    ) : (
                      <p className="text-sm text-blue-500">No active discount available</p>
                    )}
                  </div>
                  {/* Discount Name */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      New Discount Name:
                    </label>
                    <input
                      type="text"
                      className={`w-full ${
                        errors[`${book.book_id}_newDiscountName`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                      placeholder="Enter Discount Name"
                      value={book.newDiscountName}
                      onChange={(e) =>
                        handleInputChange(
                          book.book_id,
                          "newDiscountName",
                          e.target.value
                        )
                      }
                    />
                    {errors[`${book.book_id}_newDiscountName`] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[`${book.book_id}_newDiscountName`]}
                      </p>
                    )}
                  </div>
                  {/* Discount Rate */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      New Discount Rate (%):
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className={`w-full ${
                        errors[`${book.book_id}_newDiscountRate`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={book.newDiscountRate}
                      onChange={(e) =>
                        handleInputChange(
                          book.book_id,
                          "newDiscountRate",
                          e.target.value
                        )
                      }
                    />
                    <span className="block text-sm text-gray-700 text-center mt-1">
                      {book.newDiscountRate}%
                    </span>
                    {errors[`${book.book_id}_newDiscountRate`] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[`${book.book_id}_newDiscountRate`]}
                      </p>
                    )}
                  </div>
                  {/* Discount End Date */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      New Discount End Date:
                    </label>
                    <input
                      type="date"
                      className={`w-full ${
                        errors[`${book.book_id}_newDiscountEndDate`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                      value={book.newDiscountEndDate}
                      onChange={(e) =>
                        handleInputChange(
                          book.book_id,
                          "newDiscountEndDate",
                          e.target.value
                        )
                      }
                    />
                    {errors[`${book.book_id}_newDiscountEndDate`] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[`${book.book_id}_newDiscountEndDate`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Apply Discount Button */}
                <button
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={() => openConfirmationPopup(book)}
                  disabled={false}
                >
                  Apply Discount
                </button>
              </div>
            </div>
          ))}

          {/* Success Message */}
            {successMessage && (
              <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
                {successMessage}
              </div>
            )}

          {/* Confirmation Popup */}
          {confirmation.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-800">
                  Confirm Action
                </h2>
                <p className="text-sm text-gray-600 mt-4">
                  Once you apply a new discount, the previous one will be
                  deactivated. Do you wish to continue?
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
      )}
    </div>
  );
};

export default PriceManager;

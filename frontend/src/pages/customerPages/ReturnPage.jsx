import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetailsById, getReturnHistoryByOrder, createReturnRequest } from "../../services/api";

const ReturnPage = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();

  const [remainingItems, setRemainingItems] = useState([]); // Items eligible for return
  const [selectedItems, setSelectedItems] = useState({}); // User selections
  const [errors, setErrors] = useState({}); // Tracks errors for validation
  const [loading, setLoading] = useState(true); // Loading state

  const predefinedReasons = ["Damaged Item", "Wrong Item Sent", "Other"];

  // Fetch eligible items for return
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const orderResponse = await getOrderDetailsById(order_id);
      const returnResponse = await getReturnHistoryByOrder(order_id);

      const orderItems = orderResponse?.data?.orderitems || [];
      const returnHistory = returnResponse?.data || [];

      // Calculate returnable quantity and flatten data
      const remaining = orderItems
        .map((item) => {
          const totalReturned = returnHistory
            .filter((r) => r.book_id === item.book_id)
            .reduce((sum, r) => sum + r.quantity, 0);

          const returnableQuantity = item.quantity - totalReturned;

          return returnableQuantity > 0
            ? {
                ...item,
                returnableQuantity,
                book_title: item.books?.title || "Unknown Title",
                book_image_url: item.books?.image_url || "https://via.placeholder.com/50x75",
              }
            : null;
        })
        .filter(Boolean);

      setRemainingItems(remaining);
      setLoading(false);
    };

    fetchData();
  }, [order_id]);

  // Handle checkbox selection
  const handleCheckboxChange = (bookId, isChecked) => {
    setSelectedItems((prev) => ({
      ...prev,
      [bookId]: isChecked ? { quantity: "", reason: "" } : undefined,
    }));

    setErrors((prev) => ({ ...prev, [bookId]: undefined })); // Clear errors
  };

  // Handle dropdown and input changes
  const handleQuantityChange = (bookId, quantity) => {
    setSelectedItems((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], quantity },
    }));
    setErrors((prev) => ({ ...prev, [bookId]: undefined }));
  };

  const handleReasonChange = (bookId, reason) => {
    setSelectedItems((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], reason, otherReason: "" },
    }));
    setErrors((prev) => ({ ...prev, [bookId]: undefined }));
  };

  const handleOtherReasonChange = (bookId, value) => {
    setSelectedItems((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], otherReason: value },
    }));
  };

  // Submit return requests
  const handleSubmit = async () => {
    const newErrors = {};

    // Validate all fields for selected items
    Object.entries(selectedItems).forEach(([bookId, details]) => {
      if (!details.quantity) {
        newErrors[bookId] = { ...newErrors[bookId], quantity: true };
      }
      if (!details.reason) {
        newErrors[bookId] = { ...newErrors[bookId], reason: true };
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill in all required fields for the selected items.");
      return;
    }

    const requests = Object.entries(selectedItems).map(([bookId, details]) => {
      const item = remainingItems.find((i) => i.book_id === parseInt(bookId));
      return {
        order_id: parseInt(order_id),
        book_id: parseInt(bookId),
        quantity: parseInt(details.quantity),
        item_price: item.item_price,
        reason: details.reason,
        other_reason: details.otherReason || null,
      };
    });

    for (const req of requests) {
      await createReturnRequest(req.order_id, req.book_id, req.quantity, req.item_price, req.reason, req.other_reason);
    }

    alert("Return request created successfully!");
    navigate("/profile");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-[#65aa92]">Return Items from Order #{order_id}</h2>
      {remainingItems.length > 0 ? (
        remainingItems.map((item) => (
          <div key={item.book_id} className="grid grid-cols-12 gap-4 items-center py-4 border-b">
            {/* Checkbox */}
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                id={`checkbox-${item.book_id}`}
                className="w-6 h-6 text-[#65aa92] border-gray-300 rounded cursor-pointer focus:ring-[#65aa92] accent-[#65aa92]"
                onChange={(e) => handleCheckboxChange(item.book_id, e.target.checked)}
                checked={!!selectedItems[item.book_id]}
              />
            </div>


            {/* Book Details */}
            <div className="col-span-5 flex items-center space-x-4">
              <img
                src={item.book_image_url}
                alt={item.book_title}
                className="w-16 h-24 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/books/${item.book_id}`)}
              />
              <div>
                <a
                  href={`/books/${item.book_id}`}
                  className="text-xl font-semibold text-[#65aa92] hover:underline cursor-pointer mb-2 block"
                >
                  {item.book_title}
                </a>
                <p className="text-gray-500">
                  <span className="font-semibold">Returnable Quantity:</span> {item.returnableQuantity}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Price per Item:</span> ${item.item_price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity Dropdown */}
            <div className="col-span-3">
              <select
                className={`border rounded p-2 w-full ${
                  errors[item.book_id]?.quantity ? "border-red-500" : ""
                }`}
                disabled={!selectedItems[item.book_id]}
                onChange={(e) => handleQuantityChange(item.book_id, e.target.value)}
                value={selectedItems[item.book_id]?.quantity || ""}
              >
                <option value="">Select quantity</option>
                {[...Array(item.returnableQuantity)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason Dropdown and Other Input */}
            <div className="col-span-3 flex items-center space-x-2">
              <select
                className={`border rounded p-2 w-full ${
                  errors[item.book_id]?.reason ? "border-red-500" : ""
                }`}
                disabled={!selectedItems[item.book_id]}
                onChange={(e) => handleReasonChange(item.book_id, e.target.value)}
                value={selectedItems[item.book_id]?.reason || ""}
              >
                <option value="">Select a reason</option>
                {predefinedReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {/* "Other" Input Box */}
              {selectedItems[item.book_id]?.reason === "Other" && (
                <input
                  type="text"
                  placeholder="Enter reason"
                  className="border rounded p-2 w-full"
                  value={selectedItems[item.book_id]?.otherReason || ""}
                  onChange={(e) => handleOtherReasonChange(item.book_id, e.target.value)}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No items are eligible for return.</p>
      )}

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Submit Return Request
        </button>
      </div>
    </div>
  );
};

export default ReturnPage;

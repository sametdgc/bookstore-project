import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetailsById,
  cancelOrder,
  updateBookStock,
  createCancellationRequest
} from "../../services/api";

const CancelPage = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const cancelReasons = [
    "Changed mind",
    "Found better price elsewhere",
    "Delivery time too long",
    "Other",
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await getOrderDetailsById(order_id);
        setOrderItems(response.data.orderitems || []);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [order_id]);

  const handleCheckboxChange = (bookId, isChecked) => {
    setSelectedItems((prev) => ({
      ...prev,
      [bookId]: isChecked ? { reason: "" } : undefined,
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

  const handleSubmit = async () => {
    const newErrors = {};
  
    // Validate reasons for selected items
    Object.entries(selectedItems).forEach(([bookId, details]) => {
      if (!details.reason) {
        newErrors[bookId] = { reason: true };
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please provide a reason for all selected items.");
      return;
    }
  
    try {
      // Create cancellation requests for selected items
      for (const [bookId, details] of Object.entries(selectedItems)) {
        const item = orderItems.find((i) => i.book_id === parseInt(bookId));
        if (item) {
          await createCancellationRequest(
            order_id,
            parseInt(bookId),
            item.quantity,
            details.reason,
            details.otherReason
          );
        }
      }
  
      alert("Cancellation request submitted successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error creating cancellation request:", error);
      alert("An error occurred while submitting the request. Please try again.");
    }
  };
  

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-[#65aa92]">
        Cancel Items from Order #{order_id}
      </h2>
      {orderItems.length > 0 ? (
        orderItems.map((item) => (
          <div
            key={item.book_id}
            className="grid grid-cols-12 gap-4 items-center py-4 border-b"
          >
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                id={`checkbox-${item.book_id}`}
                className="w-6 h-6 text-[#65aa92] border-gray-300 rounded cursor-pointer focus:ring-[#65aa92] accent-[#65aa92]"
                onChange={(e) =>
                  handleCheckboxChange(item.book_id, e.target.checked)
                }
                checked={!!selectedItems[item.book_id]}
              />
            </div>

            <div className="col-span-5 flex items-center space-x-4">
              <img
                src={
                  item.books?.image_url || "https://via.placeholder.com/50x75"
                }
                alt={item.books?.title || "Book cover"}
                className="w-16 h-24 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/books/${item.book_id}`)}
              />
              <div>
                <a
                  href={`/books/${item.book_id}`}
                  className="text-xl font-semibold text-[#65aa92] hover:underline cursor-pointer mb-2 block"
                >
                  {item.books?.title || "Unknown Title"}
                </a>
                <p className="text-gray-500">
                  <span className="font-semibold">Quantity:</span>{" "}
                  {item.quantity}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Price per Item:</span> $
                  {item.item_price.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="col-span-6 flex items-center space-x-2">
              <select
                className={`border rounded p-2 w-full ${
                  errors[item.book_id]?.reason ? "border-red-500" : ""
                }`}
                disabled={!selectedItems[item.book_id]}
                onChange={(e) =>
                  handleReasonChange(item.book_id, e.target.value)
                }
                value={selectedItems[item.book_id]?.reason || ""}
              >
                <option value="">Select a reason</option>
                {cancelReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {selectedItems[item.book_id]?.reason === "Other" && (
                <input
                  type="text"
                  placeholder="Enter reason"
                  className="border rounded p-2 w-full"
                  value={selectedItems[item.book_id]?.otherReason || ""}
                  onChange={(e) =>
                    handleOtherReasonChange(item.book_id, e.target.value)
                  }
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No items available for cancellation.</p>
      )}

      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel Selected Items
        </button>
      </div>
    </div>
  );
};

export default CancelPage;

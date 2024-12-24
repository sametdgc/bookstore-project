import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";

const RefundManager = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("returns")
      .select(`
        return_id,
        order_id,
        book_id,
        quantity,
        item_price,
        reason,
        other_reason,
        return_status,
        request_date,
        books (title, image_url, available_quantity),
        orders!inner (
          user_id,
          users (full_name, email)
        )
      `)
      .order("request_date", { ascending: false });

    if (error) {
      console.error("Error fetching refund requests:", error.message);
    } else {
      setRefundRequests(data);
    }
    setLoading(false);
  };

  const handleApprove = async (refundId, bookId, quantity) => {
    setProcessingId(refundId);
    try {
      // Update return status to "approved"
      const { error } = await supabase
        .from("returns")
        .update({ return_status: "approved" })
        .eq("return_id", refundId);

      if (error) throw error;

      // Update UI to reflect status change
      setRefundRequests((prev) =>
        prev.map((request) =>
          request.return_id === refundId
            ? { ...request, return_status: "approved" }
            : request
        )
      );

      alert("Refund request approved successfully!");

      // Set a timer to update the status to "returned" and adjust book stock
      setTimeout(async () => {
        try {
          // Update return status to "returned"
          const { error: updateError } = await supabase
            .from("returns")
            .update({ return_status: "returned" })
            .eq("return_id", refundId);

          if (updateError) throw updateError;

          // Fetch the current available quantity for the book
          const { data: bookData, error: fetchError } = await supabase
            .from("books")
            .select("available_quantity")
            .eq("book_id", bookId)
            .single();

          if (fetchError) throw fetchError;

          const currentQuantity = bookData.available_quantity;

          // Update the available quantity
          const { error: quantityError } = await supabase
            .from("books")
            .update({ available_quantity: currentQuantity + quantity })
            .eq("book_id", bookId);

          if (quantityError) throw quantityError;

          // Update the UI to reflect the "returned" status
          setRefundRequests((prev) =>
            prev.map((request) =>
              request.return_id === refundId
                ? { ...request, return_status: "returned" }
                : request
            )
          );

          console.log(
            `Refund request #${refundId} marked as returned, and book stock updated.`
          );
          alert(
            `Refund request #${refundId} marked as returned, and book stock updated.`
          );
        } catch (err) {
          console.error(
            "Error updating status to returned or updating stock:",
            err.message
          );
        }
      }, 30000); // 30 seconds timer
    } catch (err) {
      console.error("Error approving refund:", err.message);
      alert("Failed to approve the refund request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (refundId) => {
    setProcessingId(refundId);
    try {
      const { error } = await supabase
        .from("returns")
        .update({ return_status: "rejected" })
        .eq("return_id", refundId);

      if (error) throw error;

      setRefundRequests((prev) =>
        prev.map((request) =>
          request.return_id === refundId
            ? { ...request, return_status: "rejected" }
            : request
        )
      );

      alert("Refund request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting refund:", error.message);
      alert("Failed to reject the refund request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading refund requests...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-[#65aa92] mb-6">
        Refund Management
      </h1>
      <div className="space-y-4">
        {refundRequests.map((request) => (
          <div
            key={request.return_id}
            className="border border-gray-200 rounded-lg shadow-md p-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Refund Request #{request.return_id}
                </h2>
                <p className="text-gray-600">
                  Date: {new Date(request.request_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Amount: $
                  {(request.item_price * request.quantity).toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Customer: {request.orders.users.full_name} (
                  {request.orders.users.email})
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      request.return_status === "approved"
                        ? "text-green-600"
                        : request.return_status === "rejected"
                        ? "text-red-600"
                        : request.return_status === "returned"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.return_status}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleApprove(
                      request.return_id,
                      request.book_id,
                      request.quantity
                    )
                  }
                  disabled={processingId === request.return_id}
                  className={`px-4 py-2 rounded-md transition ${
                    processingId === request.return_id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {processingId === request.return_id
                    ? "Processing..."
                    : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(request.return_id)}
                  disabled={processingId === request.return_id}
                  className={`px-4 py-2 rounded-md transition ${
                    processingId === request.return_id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {processingId === request.return_id
                    ? "Processing..."
                    : "Reject"}
                </button>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Product Details
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={request.books.image_url}
                  alt={request.books.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">{request.books.title}</p>
                  <p>Quantity Returned: {request.quantity}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                Return Reason
              </h3>
              <p>{request.reason}</p>
              {request.other_reason && (
                <p>Other Reason: {request.other_reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundManager;

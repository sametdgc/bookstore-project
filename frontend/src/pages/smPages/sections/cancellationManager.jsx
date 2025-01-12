import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";

const CancellationManager = () => {
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCancellationRequests();
  }, []);

  const fetchCancellationRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cancellations")
        .select(`
          cancellation_id,
          order_id,
          book_id,
          quantity,
          reason,
          other_reason,
          status,
          request_date,
          books (title, image_url, available_quantity),
          orders!inner (
            user_id,
            users (full_name, email)
          )
        `)
        .order("request_date", { ascending: false });

      if (error) throw error;

      setCancellationRequests(data || []);
    } catch (err) {
      console.error("Error fetching cancellation requests:", err.message);
    }
    setLoading(false);
  };

  const handleApprove = async (cancellationId, orderId, bookId, quantity) => {
    setProcessingId(cancellationId);
    try {
      // Update cancellation request status to "approved"
      const { error } = await supabase
        .from("cancellations")
        .update({ status: "approved" })
        .eq("cancellation_id", cancellationId);

      if (error) throw error;

      // Update the delivery status to "cancelled"
      const { error: deliveryError } = await supabase
        .from("deliverystatuses")
        .update({ status: "cancelled" })
        .eq("order_id", orderId);

      if (deliveryError) throw deliveryError;

      // Fetch the current stock for the book
      const { data: bookData, error: fetchError } = await supabase
        .from("books")
        .select("available_quantity")
        .eq("book_id", bookId)
        .single();

      if (fetchError) throw fetchError;

      const currentQuantity = bookData.available_quantity;

      // Update the book stock
      const { error: quantityError } = await supabase
        .from("books")
        .update({ available_quantity: currentQuantity + quantity })
        .eq("book_id", bookId);

      if (quantityError) throw quantityError;

      // Update the UI to reflect the approved status
      setCancellationRequests((prev) =>
        prev.map((request) =>
          request.cancellation_id === cancellationId
            ? { ...request, status: "approved" }
            : request
        )
      );

      alert(
        `Cancellation request #${cancellationId} approved successfully! Stock updated.`
      );
    } catch (err) {
      console.error("Error approving cancellation:", err.message);
      alert("Failed to approve the cancellation request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (cancellationId) => {
    setProcessingId(cancellationId);
    try {
      // Update cancellation request status to "rejected"
      const { error } = await supabase
        .from("cancellations")
        .update({ status: "rejected" })
        .eq("cancellation_id", cancellationId);

      if (error) throw error;

      // Update the UI to reflect the rejected status
      setCancellationRequests((prev) =>
        prev.map((request) =>
          request.cancellation_id === cancellationId
            ? { ...request, status: "rejected" }
            : request
        )
      );

      alert("Cancellation request rejected successfully!");
    } catch (err) {
      console.error("Error rejecting cancellation:", err.message);
      alert("Failed to reject the cancellation request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading cancellation requests...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-[#65aa92] mb-6">
        Cancellation Management
      </h1>
      <div className="space-y-4">
        {cancellationRequests.map((request) => (
          <div
            key={request.cancellation_id}
            className="border border-gray-200 rounded-lg shadow-md p-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Cancellation Request #{request.cancellation_id}
                </h2>
                <p className="text-gray-600">
                  Date: {new Date(request.request_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Customer: {request.orders.users.full_name} (
                  {request.orders.users.email})
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      request.status === "approved"
                        ? "text-green-600"
                        : request.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleApprove(
                      request.cancellation_id,
                      request.order_id,
                      request.book_id,
                      request.quantity
                    )
                  }
                  disabled={processingId === request.cancellation_id}
                  className={`px-4 py-2 rounded-md transition ${
                    processingId === request.cancellation_id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {processingId === request.cancellation_id
                    ? "Processing..."
                    : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(request.cancellation_id)}
                  disabled={processingId === request.cancellation_id}
                  className={`px-4 py-2 rounded-md transition ${
                    processingId === request.cancellation_id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {processingId === request.cancellation_id
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
                  <p>Quantity: {request.quantity}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                Cancellation Reason
              </h3>
              <p>{request.reason}</p>
              {request.other_reason && <p>Other Reason: {request.other_reason}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancellationManager;

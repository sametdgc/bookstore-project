import React, { useEffect, useState } from "react";
import { getDeliveryStatuses, updateDeliveryStatus } from "../../../services/api";

const DeliveryDetails = () => {
  const [deliveryData, setDeliveryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5; // Set the number of rows per page

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const { data, count } = await getDeliveryStatuses(page, itemsPerPage); // Fetch with pagination
      setDeliveryData(data);
      setTotalPages(Math.ceil(count / itemsPerPage));
    } catch (error) {
      console.error("Error fetching delivery statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDeliveryStatus(orderId, newStatus); // API call to update status
      setDeliveryData((prevData) =>
        prevData.map((item) =>
          item.order_id === orderId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4">Order ID</th>
              <th className="border-b p-4">Customer</th>
              <th className="border-b p-4">Status</th>
              <th className="border-b p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : deliveryData.length > 0 ? (
              deliveryData.map((item) => (
                <tr key={item.order_id}>
                  <td className="border-b p-4">{item.order_id}</td>
                  <td className="border-b p-4">{item.order.users.full_name}</td>
                  <td className="border-b p-4">{item.status}</td>
                  <td className="border-b p-4">
                    <select
                      className="border p-2 rounded"
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.order_id, e.target.value)
                      }
                    >
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="processing">Processing</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border-b p-4" colSpan="4">
                  No delivery data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-[#65aa92] text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-[#65aa92] text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;

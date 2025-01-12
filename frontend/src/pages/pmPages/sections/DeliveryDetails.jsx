import React, { useEffect, useState } from "react";
import {
  getDeliveryStatuses,
  updateDeliveryStatus,
} from "../../../services/api";

const DeliveryDetails = () => {
  const [deliveryData, setDeliveryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 25;

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const { data, count } = await getDeliveryStatuses(page, itemsPerPage);
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
      await updateDeliveryStatus(orderId, newStatus);
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Delivery Details
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-b p-4">Delivery ID</th>
              <th className="border-b p-4">Order ID</th>
              <th className="border-b p-4">Customer</th>
              <th className="border-b p-4">Delivery Address</th>
              <th className="border-b p-4">Books</th>
              <th className="border-b p-4">Total Price</th>
              <th className="border-b p-4">Status</th>
              <th className="border-b p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : deliveryData.length > 0 ? (
              deliveryData.map((item) => (
                <tr
                  key={item.delivery_id}
                  className="hover:bg-gray-100 transition ease-in-out"
                >
                  <td className="border-b p-4">{item.delivery_id}</td>
                  <td className="border-b p-4">{item.order_id}</td>
                  <td className="border-b p-4">
                    <div>
                      <span className="font-bold">
                        {item.order.users.full_name}
                      </span>
                      <br />
                      <span className="text-sm text-gray-500">
                        (ID: {item.order.user_id})
                      </span>
                    </div>
                  </td>
                  <td className="border-b p-4">
                    {item.order.address
                      ? `${item.order.address.address_details}, ${item.order.address.district}, ${item.order.address.city}`
                      : "Address not available"}
                  </td>
                  <td className="border-b p-4">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b p-2 text-gray-600">
                            Book ID
                          </th>
                          <th className="border-b p-2 text-gray-600">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.order.order_items.map((orderItem) => (
                          <tr key={orderItem.book_id}>
                            <td className="border-b p-2 text-gray-800">
                              {orderItem.book_id}
                            </td>
                            <td className="border-b p-2 text-gray-800">
                              {orderItem.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td className="border-b p-4">
                    ${item.order.total_price.toFixed(2)}
                  </td>
                  <td className="border-b p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : item.status === "in-transit"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b p-4">
                    <select
                      className="border p-2 rounded w-full bg-white"
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
                <td className="border-b p-4" colSpan="8">
                  No delivery data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#65aa92] text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#65aa92] text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;

import React, { useEffect, useState } from "react";
import { getDeliveryStatuses, updateDeliveryStatus } from "../../../services/api";

const DeliveryDetails = () => {
  const [deliveryData, setDeliveryData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    getDeliveryStatuses()
      .then((response) => {
        setDeliveryData(response);
      })
      .catch((error) => {
        console.error("Error fetching delivery statuses:", error);
      });
  }, []);

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
            {deliveryData.length > 0 ? (
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
                      {/* Add other statuses here */}
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
    </div>
  );
};

export default DeliveryDetails;

import React from "react";

const DeliveryDetails = () => {
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
            {/* Replace with dynamic delivery rows */}
            <tr>
              <td className="border-b p-4">12345</td>
              <td className="border-b p-4">John Doe</td>
              <td className="border-b p-4">In Transit</td>
              <td className="border-b p-4">
                <button className="text-blue-500 hover:underline">
                  Track
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryDetails;

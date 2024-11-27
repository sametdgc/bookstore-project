import React from "react";

const StockManagement = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4">Product</th>
              <th className="border-b p-4">Available Stock</th>
              <th className="border-b p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace with dynamic stock rows */}
            <tr>
              <td className="border-b p-4">Sample Product</td>
              <td className="border-b p-4">50</td>
              <td className="border-b p-4">
                <button className="text-blue-500 hover:underline">Update</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;

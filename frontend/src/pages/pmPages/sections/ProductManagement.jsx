import React from "react";

const ProductManagement = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <button className="bg-[#65aa92] text-white px-4 py-2 rounded-lg hover:bg-[#4a886e] mb-4">
        Add New Product
      </button>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4">Product Name</th>
              <th className="border-b p-4">Category</th>
              <th className="border-b p-4">Price</th>
              <th className="border-b p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace with dynamic product rows */}
            <tr>
              <td className="border-b p-4">Sample Product</td>
              <td className="border-b p-4">Category 1</td>
              <td className="border-b p-4">$100</td>
              <td className="border-b p-4 space-x-2">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;

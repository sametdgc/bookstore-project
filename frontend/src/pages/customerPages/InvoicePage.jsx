import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOrderDetailsById } from "../../services/api";

const InvoicePage = () => {
  const [searchParams] = useSearchParams();
  const orderID = searchParams.get("orderID");

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderID) {
        console.error("Order ID is missing");
        setLoading(false);
        return;
      }

      const { data, error } = await getOrderDetailsById(orderID);

      if (error) {
        console.error("Error fetching order details:", error.message);
      } else {
        setOrderDetails(data);
      }

      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderID]);

  if (loading) return <div>Loading...</div>;
  if (!orderDetails) return <div>No order details found</div>;

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-semibold text-[#65aa92]">Invoice</h1>
      <p className="text-sm text-gray-600 mt-2">Order ID: {orderDetails.order_id}</p>
      <p className="text-sm text-gray-600">
        Date: {new Date(orderDetails.order_date).toLocaleDateString()}
      </p>

      {/* Customer Info */}
      <div className="bg-[#f0fdf4] p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold text-[#065f46]">Customer Details</h2>
        <p className="text-gray-700 mt-2">
          <strong>Name:</strong> {orderDetails.users.full_name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {orderDetails.users.email}
        </p>
        <p className="text-gray-700">
          <strong>Phone:</strong> {orderDetails.users.phone_number}
        </p>
      </div>

      {/* Address */}
      <div className="bg-[#f0fdf4] p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold text-[#065f46]">Shipping Address</h2>
        <p className="text-gray-700 mt-2">
          <strong>City:</strong> {orderDetails.addresses.city}
        </p>
        <p className="text-gray-700">
          <strong>District:</strong> {orderDetails.addresses.district}
        </p>
        <p className="text-gray-700">
          <strong>Details:</strong> {orderDetails.addresses.address_details}
        </p>
        <p className="text-gray-700">
          <strong>Zip Code:</strong> {orderDetails.addresses.zip_code}
        </p>
      </div>

      {/* Order Items */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Order Items</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">Product</th>
              <th className="border border-gray-200 px-4 py-2 text-center">Quantity</th>
              <th className="border border-gray-200 px-4 py-2 text-right">Unit Price</th>
              <th className="border border-gray-200 px-4 py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.orderitems.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-200 px-4 py-2">{item.books.title}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                <td className="border border-gray-200 px-4 py-2 text-right">
                  ${item.item_price.toFixed(2)}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-right">
                  ${(item.quantity * item.item_price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details */}
      <div className="text-left bg-[#f0fdf4] p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold text-[#065f46]">Payment Details</h2>
        <p className="text-gray-700 mt-2">
          <strong>Total Amount:</strong> ${orderDetails.total_price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default InvoicePage;

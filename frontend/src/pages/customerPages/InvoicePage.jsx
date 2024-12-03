import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOrderDetailsById } from "../../services/api";
import { invoicePDF } from "../../components";



const sendEmail = async (orderDetails) => {
  try {
    const response = await fetch("http://localhost:5000/api/send-invoice-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: orderDetails.users.email,
        orderId: orderDetails.order_id,
        orderDetails: orderDetails, // Pass all order details for PDF generation
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to send email:", result.error);
      alert("Failed to send the email. Please try again.");
    } else {
      console.log("Email sent successfully:", result);
      alert("Email sent successfully!");
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    alert("An error occurred while sending the email.");
  }
};


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

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!orderDetails) return <div className="text-center mt-20">No order details found</div>;

  return (
    <div className="container mx-auto py-16 px-8 bg-gray-50 shadow-md rounded-lg">
      {/* Invoice Information */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">
            <strong>Invoice #:</strong> {orderDetails.order_id}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Date:</strong> {new Date(orderDetails.order_date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            <strong>Customer:</strong> {orderDetails.users.full_name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {orderDetails.users.email}
          </p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-gray-100 p-4 rounded-md mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Bill To:</h3>
        <p className="text-sm text-gray-600">{orderDetails.users.full_name}</p>
        <p className="text-sm text-gray-600">{orderDetails.addresses.address_details}</p>
        <p className="text-sm text-gray-600">
          {orderDetails.addresses.city}, {orderDetails.addresses.district}
        </p>
        <p className="text-sm text-gray-600">Phone: {orderDetails.users.phone_number}</p>
      </div>

      {/* Order Items Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Items</h3>
        {orderDetails.orderitems.length > 0 ? (
          <table className="table-auto w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderitems.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="border border-gray-300 px-4 py-2">{item.books.title}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ${item.item_price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ${(item.quantity * item.item_price).toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Table row for the shipping */}
              <tr className="bg-gray-200">
                <td colSpan="3" className="border border-gray-300 px-4 py-2 text-right">
                  Shipping 
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  $10.00
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-600">No items found in the order.</p>
        )}

      </div>

      {/* Payment Summary */}
      <div className="flex justify-between items-start mt-8">
        <button
          onClick={() => invoicePDF(orderDetails)}
          className="px-4 py-2 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b]"
        >
          Download PDF
        </button>
        <button
          onClick={() =>
            sendEmail(orderDetails)
          }
          className="px-4 py-2 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b]"
        >
          Send Email
        </button>


        <div className="bg-gray-100 p-4 rounded-md w-1/3 shadow-sm">
          <p className="text-sm text-gray-600">
            <strong>Subtotal:</strong> ${(orderDetails.total_price-10).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Shipping:</strong> $10.00
          </p>
          <p className="text-lg font-bold text-gray-800 mt-2">
            <strong>Total:</strong> ${orderDetails.total_price.toFixed(2)}
            <p className="text-sm text-gray-600">
            VAT included
            </p>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 mt-8">
        <p>Thank you for your business!</p>
        <p>Please make all checks payable to ChapterZero.</p>
        <p>www.chzero.com || chzero@gmail.com</p>
      </div>
    </div>
  );
};

export default InvoicePage;

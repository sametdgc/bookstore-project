import React, { useEffect, useState } from "react";
import { getAllInvoices, getOrderDetailsById } from "../../../services/api";
import { useSearchParams } from "react-router-dom";
import { invoicePDF } from "../../../components/invoicePDF";

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [expandedInvoice, setExpandedInvoice] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial date values from the URL
  const startDateQuery = searchParams.get("startDate") || "";
  const endDateQuery = searchParams.get("endDate") || "";

  const [startDateInput, setStartDateInput] = useState(startDateQuery);
  const [endDateInput, setEndDateInput] = useState(endDateQuery);

  useEffect(() => {
    // Fetch invoices on component mount
    getAllInvoices()
      .then((response) => {
        setInvoices(response);
        applyFilters(response, startDateQuery, endDateQuery);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  }, []);

  useEffect(() => {
    // Apply filters whenever the URL query params change
    applyFilters(invoices, startDateQuery, endDateQuery);
    setStartDateInput(startDateQuery); // Update input states
    setEndDateInput(endDateQuery);
  }, [searchParams, invoices]);

  const applyFilters = (invoicesList, startDate, endDate) => {
    const filtered = invoicesList.filter((invoice) => {
      const invoiceDate = new Date(invoice.order_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || invoiceDate >= start) && (!end || invoiceDate <= end);
    });
    setFilteredInvoices(filtered);
  };

  const handleFilter = () => {
    // Update the URL query parameters
    setSearchParams({ startDate: startDateInput, endDate: endDateInput });
  };

  const toggleDetails = (orderId) => {
    setExpandedInvoice(expandedInvoice === orderId ? null : orderId);
  };

  const handleSaveOrPrint = async (orderId, action) => {
    try {
      // Fetch detailed invoice data
      console.log(orderId);
      const orderDetails = await getOrderDetailsById(orderId);
      console.log(orderDetails);
      // Generate PDF
      const pdfDoc = await invoicePDF(orderDetails.data);

      console.log(pdfDoc);
      if (action === "save") {
        // Save PDF file
        pdfDoc.save(`Invoice_${orderId}.pdf`);
      } else if (action === "print") {
        // Open PDF in new tab for printing
        pdfDoc.autoPrint();
        window.open(pdfDoc.output("bloburl"), "_blank");
      }
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-[#65aa92] mb-6">
        Invoice Manager
      </h1>

      {/* Date Filter */}
      <div className="flex items-end space-x-4 mb-6">
      <div>
        <label className="block text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={startDateInput}
          onChange={(e) => setStartDateInput(e.target.value)}
          className="p-2 border rounded-md h-10"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          value={endDateInput}
          onChange={(e) => setEndDateInput(e.target.value)}
          className="p-2 border rounded-md h-10"
        />
      </div>
      <button
        onClick={handleFilter}
        className="px-4 py-2 bg-[#65aa92] text-white rounded-md hover:bg-green-600 transition h-10"
      >
        Filter
      </button>
    </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.order_id}
            className="border border-gray-200 rounded-lg shadow-md p-4 bg-white"
          >
            {/* Invoice Summary */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Invoice #{invoice.order_id}
                </h2>
                <p className="text-gray-600">
                  Date: {new Date(invoice.order_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Total: ${invoice.total_price.toFixed(2)}
                </p>
              </div>
                <div className="flex space-x-2">
                    <button
                    onClick={() => toggleDetails(invoice.order_id)}
                    className="bg-[#65aa92] hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                    >
                    {expandedInvoice === invoice.order_id
                        ? "Hide Details"
                        : "Show Details"}
                    </button>
                    <button
                    onClick={() => handleSaveOrPrint(invoice.order_id, "save")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                    >Save
                    </button>
                    <button
                    onClick={() => handleSaveOrPrint(invoice.order_id, "print")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
                    >
                    Print
                    </button>
                </div>
            </div>

            {/* Invoice Details */}
            {expandedInvoice === invoice.order_id && (
              <div className="mt-4 border-t pt-4">
                {/* User Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Customer Details
                  </h3>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {invoice.users.full_name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {invoice.users.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {invoice.users.phone_number}
                  </p>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Shipping Address
                  </h3>
                  <p>
                    {invoice.addresses.city}, {invoice.addresses.district}
                  </p>
                  <p>{invoice.addresses.address_details}</p>
                  <p>Zip Code: {invoice.addresses.zip_code}</p>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-700">
                    Order Items
                  </h3>
                  {invoice.orderitems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border-b last:border-none"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.books.image_url}
                          alt={item.books.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.books.title}</p>
                          <p className="text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        ${item.item_price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceManager;

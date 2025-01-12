import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReturnHistoryByOrder } from "../../services/api";

// Helper function to check if order is delivered
const isOrderDelivered = (delivery_status) => {
  console.log(delivery_status);
  return delivery_status === "delivered";
};

// Helper function to check return eligibility (within 30 days)
const isOrderReturnable = (orderDate) => {
  const currentDate = new Date();
  const orderDateObj = new Date(orderDate);
  const differenceInTime = currentDate - orderDateObj;
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays <= 30;
};

const OrderDetailsWindow = ({ order }) => {
  const navigate = useNavigate();
  const [isOrderItemsExpanded, setIsOrderItemsExpanded] = useState(false);
  const [isReturnedItemsExpanded, setIsReturnedItemsExpanded] = useState(false);
  const [returnHistory, setReturnHistory] = useState([]);

  // Fetch return history
  useEffect(() => {
    const fetchReturnHistory = async () => {
      const { data, error } = await getReturnHistoryByOrder(order.order_id);
      if (data) setReturnHistory(data);
      else console.error("Error fetching return history:", error);
    };
    fetchReturnHistory();
  }, [order.order_id]);

  // Merge return history with order items
  const returnedItems = returnHistory.map((returnItem) => {
    const matchingBook = order.order_items.find(
      (item) => item.book_id === returnItem.book_id
    );
    return {
      ...returnItem,
      book_title: matchingBook?.book_title,
      book_image_url: matchingBook?.book_image_url,
    };
  });

  const orderItems = order.order_items.filter((item) => {
    const returned = returnHistory.find((r) => r.book_id === item.book_id);
    return !returned;
  });

  const handleReturnClick = () => {
    navigate(`/return/${order.order_id}`);
  };

  const handleCancelClick = () => {
    navigate(`/cancel/${order.order_id}`);
  };

  return (
    <div className="mt-6">
      {/* Expandable Section - Order Items */}
      <div className="border-b pb-4 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsOrderItemsExpanded(!isOrderItemsExpanded)}
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Order Items ({orderItems.length})
          </h3>
          <span className="text-[#65aa92]">
            {isOrderItemsExpanded ? "▲" : "▼"}
          </span>
        </div>

        {isOrderItemsExpanded && (
          <div className="mt-4">
            {/* Column Headers */}
            {orderItems.length > 0 ? (
              <>
                <div className="grid grid-cols-5 gap-4 py-2 font-semibold text-gray-700 border-b">
                  <span className="col-span-2">Book Details</span>
                  <span className="text-center">Price</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Subtotal</span>
                </div>

                {/* Order Items */}
                {orderItems.map((item) => (
                  <div
                    key={item.book_id}
                    className="grid grid-cols-5 gap-4 items-center border-b py-2"
                  >
                    {/* Book Image and Title */}
                    <div className="col-span-2 flex items-center">
                      <img
                        src={
                          item.book_image_url ||
                          "https://via.placeholder.com/50x75"
                        }
                        alt={item.book_title}
                        className="w-16 h-24 object-cover rounded cursor-pointer"
                        onClick={() => navigate(`/books/${item.book_id}`)}
                      />
                      <span
                        onClick={() => navigate(`/books/${item.book_id}`)}
                        className="ml-4 font-semibold text-[#65aa92] hover:underline cursor-pointer"
                      >
                        {item.book_title}
                      </span>
                    </div>

                    {/* Price */}
                    <span className="text-gray-700 text-center">
                      ${item.item_price.toFixed(2)}
                    </span>

                    {/* Quantity */}
                    <span className="text-gray-700 text-center">
                      {item.quantity}
                    </span>

                    {/* Subtotal */}
                    <span className="text-gray-700 text-right">
                      ${(item.item_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                {/* Shipping Price */}
                <div className="text-right mt-2 font-semibold text-gray-800">
                  Shipping: <span className="text-[#65aa92]">$10.00</span>
                </div>

                {/* Return or Cancel Button */}
                <div className="text-right mt-4">
                  {isOrderDelivered(order.delivery_status) ? (
                    isOrderReturnable(order.order_date) && (
                      <button
                        onClick={handleReturnClick}
                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                      >
                        Return Item(s)
                      </button>
                    )
                  ) : (
                    <button
                      onClick={handleCancelClick}
                      className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Message when no order items exist */}
                <div className="py-6 text-center text-gray-600 text-lg">
                  All items were requested to be returned.
                </div>

                {/* Shipping Price */}
                <div className="text-right mt-2 font-semibold text-gray-800">
                  Shipping: <span className="text-[#65aa92]">$10.00</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Expandable Section - Returned Items */}
      <div className="border-b pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsReturnedItemsExpanded(!isReturnedItemsExpanded)}
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Return Requests ({returnedItems.length})
          </h3>
          <span className="text-[#65aa92]">
            {isReturnedItemsExpanded ? "▲" : "▼"}
          </span>
        </div>

        {isReturnedItemsExpanded && (
          <div className="mt-4">
            {/* Column Headers */}
            {returnedItems.length > 0 ? (
              <>
                <div className="grid grid-cols-8 gap-4 py-2 font-semibold text-gray-700 border-b">
                  <span className="col-span-2">Book Details</span>
                  <span className="text-center">Price</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-center">Subtotal</span>
                  <span className="text-center">Reason</span>
                  <span className="text-center">Request Date</span>
                  <span className="text-center">Status</span>
                </div>

                {/* Returned Items */}
                {returnedItems.map((item) => (
                  <div
                    key={item.book_id}
                    className="grid grid-cols-8 gap-4 items-center border-b py-2"
                  >
                    {/* Book Image and Title */}
                    <div className="col-span-2 flex items-center">
                      <img
                        src={
                          item.book_image_url ||
                          "https://via.placeholder.com/50x75"
                        }
                        alt={item.book_title}
                        className="w-16 h-24 object-cover rounded cursor-pointer"
                        onClick={() => navigate(`/books/${item.book_id}`)}
                      />
                      <span
                        onClick={() => navigate(`/books/${item.book_id}`)}
                        className="ml-4 font-semibold text-[#65aa92] hover:underline cursor-pointer"
                      >
                        {item.book_title}
                      </span>
                    </div>

                    {/* Price */}
                    <span className="text-gray-700 text-center">
                      ${item.item_price.toFixed(2)}
                    </span>

                    {/* Quantity */}
                    <span className="text-gray-700 text-center">
                      {item.quantity}
                    </span>

                    {/* Subtotal */}
                    <span className="text-gray-700 text-center">
                      ${(item.item_price * item.quantity).toFixed(2)}
                    </span>

                    {/* Return Reason */}
                    <span className="text-gray-500 text-center italic">
                      {item.reason === "Other"
                        ? `Other: ${item.other_reason}`
                        : item.reason}
                    </span>

                    {/* Request Date */}
                    <span className="text-gray-700 text-center">
                      {new Date(item.request_date)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </span>

                    {/* Return Status */}
                    <span className="text-sm font-semibold text-center text-yellow-500">
                      {item.return_status || "Pending"}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="py-6 text-center text-gray-600 text-lg">
                No return requests were made for this order.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsWindow;

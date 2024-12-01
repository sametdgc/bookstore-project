import React from "react";
import { useNavigate } from "react-router-dom";

const OrderDetailsWindow = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <div className="grid grid-cols-5 gap-4 mb-4">
        <h3 className="col-span-3 text-lg font-semibold text-gray-800">
          Item
        </h3>
        <span className="col-span-1 text-lg font-semibold text-gray-800 text-center">
          Quantity
        </span>
        <span className="col-span-1 text-lg font-semibold text-gray-800 text-right">
          Price
        </span>
      </div>
      <div className="space-y-4">
        {order.order_items.map((item) => (
          <div
            key={item.book_id}
            className="grid grid-cols-5 gap-4 items-center border-b last:border-b-0 py-4"
          >
            {/* Book Image and Title */}
            <div className="col-span-3 flex items-center">
              <img
                src={item.book?.image_url || "https://via.placeholder.com/50x75"}
                alt={item.book?.title}
                className="w-16 h-24 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/books/${item.book_id}`)}
              />
              <a
                href={`/books/${item.book_id}`}
                className="text-lg font-semibold text-[#65aa92] hover:underline cursor-pointer ml-4"
              >
                {item.book?.title}
              </a>
            </div>

            {/* Quantity */}
            <span className="col-span-1 text-lg font-medium text-gray-800 text-center">
              {item.quantity}
            </span>

            {/* Item Price */}
            <span className="col-span-1 text-lg font-medium text-gray-800 text-right">
              ${item.item_price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailsWindow;

import React from "react";
import { Link } from "react-router-dom";

const OrderSummary = ({ cart, shippingCost, calculateTotalPrice }) => {
  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      <ul className="space-y-6">
        {cart.map((item) => (
          <li key={item.book_id} className="flex items-start justify-between">
            <Link to={`/books/${item.book.book_id}`} className="flex-shrink-0">
              <img
                src={item.book.image_url || "https://via.placeholder.com/50x75"}
                alt={item.book.title || "Unknown Title"}
                className="w-16 h-24 object-cover rounded hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="flex-1 ml-4">
              <Link
                to={`/books/${item.book.book_id}`}
                className="hover:text-[#65aa92] transition-colors"
              >
                <h3 className="text-lg font-semibold">
                  {item.book.title || "Unknown Title"}
                </h3>
              </Link>
              <p className="text-gray-500 mt-1">
                {item.book.discount > 0 ? (
                  <>
                    <span className="text-[#4a886e] font-semibold">
                      ${(item.book.price * (1 - item.book.discount / 100)).toFixed(2)}
                    </span>{" "}
                    <span className="line-through text-sm text-gray-400 ml-2">
                      ${item.book.price.toFixed(2)}
                    </span>{" "}
                    x {item.quantity}
                  </>
                ) : (
                  <>
                    ${item.book.price.toFixed(2)} x {item.quantity}
                  </>
                )}
              </p>
            </div>
            <p className="font-semibold text-right w-24">
              {item.book.discount > 0 ? (
                <>
                  <span className="text-[#4a886e] font-semibold">
                    ${(item.book.price * (1 - item.book.discount / 100) * item.quantity).toFixed(2)}
                  </span>
                  <br />
                  <span className="line-through text-sm text-gray-400">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  ${(item.book.price * item.quantity).toFixed(2)}
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
      <div className="space-y-4 bg-[#f0fdf4] p-6 rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-[#065f46]">Subtotal:</span>
          <span className="text-lg font-semibold text-[#065f46]">
            $
            {cart
              .reduce(
                (total, item) => total + item.book.price * item.quantity * (100-item.book.discount) / 100,
                0
              )
              .toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-[#065f46]">Shipping:</span>
          <span className="text-lg font-semibold text-[#065f46]">
            ${shippingCost.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-[#c7f3e0] pt-4">
          <span className="text-xl font-bold text-[#065f46]">Total:</span>
          <span className="text-xl font-extrabold text-[#065f46]">
            ${Number(calculateTotalPrice()).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

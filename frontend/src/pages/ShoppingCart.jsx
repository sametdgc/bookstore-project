import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [shippingCost, setShippingCost] = useState(10.00); // Default shipping cost
  const navigate = useNavigate();

  // Load cart items from localStorage on initial load and aggregate duplicates
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const aggregatedCart = aggregateCart(savedCart);
    setCart(aggregatedCart);
  }, []);

  // Helper function to aggregate items in the cart by quantity
  const aggregateCart = (cartItems) => {
    const cartMap = {};

    cartItems.forEach(item => {
      if (cartMap[item.book_id]) {
        cartMap[item.book_id].quantity += 1;
      } else {
        cartMap[item.book_id] = { ...item, quantity: 1 };
      }
    });

    return Object.values(cartMap);
  };

  // Function to calculate subtotal for each item
  const calculateItemSubtotal = (item) => (item.price * item.quantity).toFixed(2);

  // Function to calculate total price (Subtotal + Shipping)
  const calculateTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return (subtotal + shippingCost).toFixed(2);
  };

  // Function to calculate subtotal (products only, no shipping)
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Function to update quantity of an item
  const updateQuantity = (bookId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.book_id === bookId
        ? { ...item, quantity: newQuantity }
        : item
    ).filter(item => item.quantity > 0); // Remove items with quantity <= 0

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(expandCart(updatedCart)));
  };

  // Function to remove an item
  const handleRemove = (bookId) => {
    const updatedCart = cart.filter(item => item.book_id !== bookId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(expandCart(updatedCart)));
  };

  // Helper function to expand aggregated cart back into a list for localStorage
  const expandCart = (cartItems) => {
    const expandedCart = [];

    cartItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedCart.push({ ...item, quantity: 1 });
      }
    });

    return expandedCart;
  };

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-semibold text-[#65aa92]">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-lg text-gray-600 mt-4">Your shopping cart is currently empty.</p>
      ) : (
        <div>
          <table className="table-auto w-full my-4">
            <thead>
              <tr className="text-left">
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.book_id} className="border-b">
                  <td className="flex items-center">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/50x75'}
                      alt={`${item.title} cover`}
                      className="w-12 h-16 object-cover mr-4 rounded"
                    />
                    {/* Make the title clickable */}
                    <span
                      className="font-semibold text-[#65aa92] hover:underline cursor-pointer"
                      onClick={() => navigate(`/books/${item.book_id}`)}
                    >
                      {item.title}
                    </span>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-l"
                        onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-r"
                        onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${calculateItemSubtotal(item)}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(item.book_id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Updated Subtotal, Shipping, and Total Section */}
          <div className="text-right my-4 bg-[#f0fdf4] p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-[#065f46]">Subtotal:</span>
              <span className="text-lg font-semibold text-[#065f46]">${calculateSubtotal()}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-[#065f46]">Shipping:</span>
              <span className="text-lg font-semibold text-[#065f46]">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#c7f3e0] pt-4">
              <span className="text-xl font-bold text-[#065f46]">Total:</span>
              <span className="text-xl font-extrabold text-[#065f46]">${calculateTotalPrice()}</span>
            </div>
          </div>

          {/* Complete Purchase Button */}
          <button
            className="mt-6 px-4 py-2 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b] transition-colors"
            onClick={() => {
              navigate('/checkout');
              console.log('Complete purchase clicked');
            }}
          >
            Complete Purchase
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
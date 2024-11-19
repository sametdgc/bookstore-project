import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
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

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Function to remove an item from the cart
  const handleRemove = (bookId) => {
    const updatedCart = cart
      .map(item => (item.book_id === bookId ? { ...item, quantity: item.quantity - 1 } : item))
      .filter(item => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(expandCart(updatedCart))); // Update localStorage
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
          <ul className="my-4">
            {cart.map((item) => (
              <li key={item.book_id} className="flex justify-between items-center my-2">
                <div className="flex items-center">
                  {/* Thumbnail image */}
                  <img
                    src={item.image_url || 'https://via.placeholder.com/50x75'}
                    alt={`${item.title} cover`}
                    className="w-12 h-16 object-cover mr-4 rounded"
                  />
                  {/* Book title, price, and conditional quantity */}
                  <span className="font-semibold">
                    {item.title} - ${item.price.toFixed(2)}
                    {item.quantity > 1 && ` x (${item.quantity})`} {/* Show only if quantity > 1 */}
                  </span>
                </div>
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.book_id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xl font-bold">
            Total: ${calculateTotalPrice()}
          </div>

          {/* Complete Purchase Button */}
          <button
            className="mt-6 px-4 py-2 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b] transition-colors"
            onClick={() => {
              navigate('/checkout')
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

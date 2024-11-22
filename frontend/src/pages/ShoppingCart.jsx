import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, getCartItems, updateCartItemQuantity, removeCartItem, getOrCreateCartByUserId, getBookDetailsById,
  getLocalCartItems, updateLocalCartItemQuantity, removeItemFromLocalCart } from '../services/api';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [shippingCost, setShippingCost] = useState(10.0); // Default shipping cost
  const [user, setUser] = useState(null); // Track the logged-in user
  const navigate = useNavigate();

  // Fetch user and load their cart on mount
  useEffect(() => {
    const loadCart = async () => {
      const currentUser = await fetchUser(); // Get the current user (logged in or null)
      setUser(currentUser);
  
      if (currentUser) {
        // Logged-in user: Fetch their cart from the database
        const userCartItems = await getCartItems(currentUser.user_metadata.custom_incremented_id);
        setCart(userCartItems || []);
      } else {
        // Anonymous user: Load the cart from localStorage
        const savedCart = getLocalCartItems();
  
        // Fetch book details for each item in the cart
        const enrichedCart = await Promise.all(
          savedCart.map(async (item) => {
            const bookDetails = await getBookDetailsById(item.book_id);
            return {
              ...item,
              ...bookDetails, // Merge the book details into the item
            };
          })
        );
  
        setCart(enrichedCart);
      }
    };
  
    loadCart();
  }, []);

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
  // Function to update quantity of an item
const updateQuantity = async (bookId, newQuantity) => {
  if (newQuantity <= 0) {
    // If the new quantity is 0 or less, remove the item
    await handleRemove(bookId);
    return;
  }

  if (user) {
    // Logged-in user: Update quantity in the database
    const userId = user.user_metadata.custom_incremented_id;
    const cartData = await getOrCreateCartByUserId(userId);
    await updateCartItemQuantity(cartData.cart_id, bookId, newQuantity);

    // Reload the cart from the database
    const updatedCart = await getCartItems(userId);
    setCart(updatedCart);
  } else {
    // Anonymous user: Update quantity in localStorage using API function
    const updatedCart = updateLocalCartItemQuantity(bookId, newQuantity);
    setCart(updatedCart);
  }
};

  // Function to remove an item
  const handleRemove = async (bookId) => {
    if (user) {
      // Logged-in user: Remove item from the database
      const userId = user.user_metadata.custom_incremented_id;
      const cartData = await getOrCreateCartByUserId(userId);
      await removeCartItem(cartData.cart_id, bookId);
  
      // Reload the cart from the database
      const updatedCart = await getCartItems(userId);
      setCart(updatedCart);
    } else {
      // Anonymous user: Remove item using the API function
      const updatedCart = removeItemFromLocalCart(bookId);
      setCart(updatedCart); // Update the state
    }
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
              {cart.map((item) => {
                // Dynamically handle book details for logged-in vs. anonymous users
                const title = item.book?.title || item.title || 'Unknown Title';
                const imageUrl = item.book?.image_url || item.image_url || 'https://via.placeholder.com/50x75';
                const price = item.book?.price || item.price || 0;

                return (
                  <tr key={item.book_id} className="border-b">
                    <td className="flex items-center">
                      <img
                        src={imageUrl}
                        alt={`${title} cover`}
                        className="w-12 h-16 object-cover mr-4 rounded"
                      />
                      <span
                        className="font-semibold text-[#65aa92] hover:underline cursor-pointer"
                        onClick={() => navigate(`/books/${item.book_id}`)}
                      >
                        {title}
                      </span>
                    </td>
                    <td>${price.toFixed(2)}</td>
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
                    <td>${calculateItemSubtotal({ ...item, price })}</td>
                    <td>
                      <button
                        onClick={() => handleRemove(item.book_id)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
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
              if (user) {
                navigate('/checkout');
              } else {
                alert('Please log in to complete your purchase.');
              }
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

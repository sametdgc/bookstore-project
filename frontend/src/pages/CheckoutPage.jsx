import React, { useState, useEffect } from 'react';
import visaLogo from '../assets/visa-logo.png';
import mastercardLogo from '../assets/logo-mastercard.png';
import troyLogo from '../assets/troy-logo.png';
import bkmExpressLogo from '../assets/bkm-express-logo.png';

const CheckoutPage = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
  });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const aggregatedCart = aggregateCart(savedCart);
    setCart(aggregatedCart);
  }, []);

  const aggregateCart = (cartItems) => {
    const cartMap = {};
    cartItems.forEach((item) => {
      if (cartMap[item.book_id]) {
        cartMap[item.book_id].quantity += 1;
      } else {
        cartMap[item.book_id] = { ...item, quantity: 1 };
      }
    });
    return Object.values(cartMap);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'expiryDate') {
      const formattedValue = formatExpiryDate(value);
      setCardDetails({ ...cardDetails, expiryDate: formattedValue });
    } else if (name === 'cardNumber') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 16);
      setCardDetails({ ...cardDetails, cardNumber: formattedValue });
    } else if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 3);
      setCardDetails({ ...cardDetails, cvv: formattedValue });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const formatExpiryDate = (value) => {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length === 1) return digitsOnly;

    if (digitsOnly.length === 2) {
      const month = digitsOnly;
      if (parseInt(month, 10) > 12 || parseInt(month, 10) === 0) return '';
      return `${month}`;
    }

    const month = digitsOnly.slice(0, 2);
    const year = digitsOnly.slice(2, 4);
    if (parseInt(month, 10) > 12 || parseInt(month, 10) === 0) return '';
    return `${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress({ ...deliveryAddress, [name]: value });
  };

  const handleConfirmOrder = () => {
    if (
      Object.values(cardDetails).some((value) => value.trim() === '') ||
      Object.values(deliveryAddress).some((value) => value.trim() === '')
    ) {
      alert('Please fill in all required fields.');
    } else {
      console.log('Order confirmed:', { cardDetails, deliveryAddress, cart });
      alert('Order confirmed!');
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-semibold text-[#65aa92] text-center mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Delivery Address Section */}
        <div className="col-span-2 bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
          <div className="space-y-4 mb-8">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={deliveryAddress.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={deliveryAddress.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={deliveryAddress.state}
                onChange={handleInputChange}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={deliveryAddress.zip}
                onChange={handleInputChange}
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={deliveryAddress.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4">Credit/Debit Card Payment</h2>
          <div className="space-y-4">
            {/* Payment Icons */}
            <div className="flex items-center space-x-4 mb-4">
              <img src={visaLogo} alt="Visa" className="w-12 h-8 object-contain" />
              <img src={mastercardLogo} alt="Mastercard" className="w-12 h-8 object-contain" />
              <img src={troyLogo} alt="Troy" className="w-12 h-8 object-contain" />
              <img src={bkmExpressLogo} alt="BKM Express" className="w-12 h-8 object-contain" />
            </div>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number (16 digits)"
              value={cardDetails.cardNumber}
              onChange={handleCardInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="cardholderName"
              placeholder="Cardholder Name"
              value={cardDetails.cardholderName}
              onChange={handleCardInputChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleCardInputChange}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV (3 digits)"
                value={cardDetails.cvv}
                onChange={handleCardInputChange}
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-6">
            {cart.map((item) => (
            <li key={item.book_id} className="flex items-start justify-between">
                {/* Book Thumbnail */}
                <img
                src={item.image_url || 'https://via.placeholder.com/50x75'}
                alt={item.title}
                className="w-16 h-24 object-cover rounded"
                />
                {/* Book Details */}
                <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500 mt-1">
                    ${item.price.toFixed(2)} x {item.quantity}
                </p>
                </div>
                {/* Total Price for this Book */}
                <p className="font-semibold text-right w-24">
                ${(item.price * item.quantity).toFixed(2)}
                </p>
            </li>
            ))}
        </ul>
          <div className="mt-4 text-lg font-bold">
            Total: ${calculateTotalPrice()}
          </div>
        </div>
      </div>

      {/* Confirm Order Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleConfirmOrder}
          className="px-6 py-3 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b] transition"
        >
          Confirm Your Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;

import React, { useState, useEffect } from "react";
import visaLogo from "../assets/visa-logo.png";
import mastercardLogo from "../assets/logo-mastercard.png";
import troyLogo from "../assets/troy-logo.png";
import bkmExpressLogo from "../assets/bkm-express-logo.png";

const CheckoutPage = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
  });

  const [cart, setCart] = useState([]);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
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
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardDetails({ ...cardDetails, [name]: formattedValue });
    validateField(name, formattedValue);
  };

  const formatExpiryDate = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length === 0) return "";
    if (digitsOnly.length === 1) return digitsOnly;
    if (digitsOnly.length === 2) {
      const month = digitsOnly;
      if (parseInt(month, 10) > 12 || parseInt(month, 10) === 0) return "";
      return `${month}`;
    }
    const month = digitsOnly.slice(0, 2);
    const year = digitsOnly.slice(2, 4);
    if (parseInt(month, 10) > 12 || parseInt(month, 10) === 0) return "";
    return `${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress({ ...deliveryAddress, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "cardNumber":
        error = value.length !== 16 ? "Card number must be 16 digits." : "";
        break;
      case "cardholderName":
        error = value.trim() === "" ? "Cardholder name is required." : "";
        break;
      case "expiryDate":
        error =
          value.length !== 5 ? "Expiry date must be in MM/YY format." : "";
        break;
      case "cvv":
        error = value.length !== 3 ? "CVV must be 3 digits." : "";
        break;
      case "email":
        error = !/\S+@\S+\.\S+/.test(value) ? "Invalid email address." : "";
        break;
      default:
        error = value.trim() === "" ? "This field is required." : "";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const validateFields = () => {
    let isValid = true;

    // Validate delivery address
    Object.keys(deliveryAddress).forEach((key) => {
      if (!validateField(key, deliveryAddress[key])) {
        isValid = false;
      }
    });

    // Validate card details
    Object.keys(cardDetails).forEach((key) => {
      if (!validateField(key, cardDetails[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleConfirmOrder = () => {
    setGeneralError("");

    if (!validateFields()) {
      setGeneralError("Please fill in all required fields correctly.");
      return;
    }

    // Create and show the processing alert
    const processingAlert = document.createElement("div");
    processingAlert.innerHTML = `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-sm w-full">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#65aa92] mb-4"></div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Processing Payment</h2>
          <p class="text-gray-600 text-center">
            Please wait while we process your payment. This may take a few moments.
          </p>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(processingAlert);

    // Simulate payment processing
    setTimeout(() => {
      // Remove processing alert
      document.body.removeChild(processingAlert);

      // Create and show the success alert
      const successAlert = document.createElement("div");
      successAlert.innerHTML = `
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-sm w-full">
          <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onclick="this.closest('.fixed').remove()">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex flex-col items-center">
            <svg class="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Purchase Successful!</h2>
            <p class="text-gray-600 text-center">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>
        </div>
      </div>
    `;
      document.body.appendChild(successAlert);
    }, 2000); // The success alert will show after 2 seconds
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-semibold text-[#65aa92] text-center mb-8">
        Checkout
      </h1>

      {generalError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{generalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Delivery Address Section */}
        <div className="col-span-2 bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
          <div className="space-y-4 mb-8">
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={deliveryAddress.address}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  errors.address ? "border-red-500" : ""
                }`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={deliveryAddress.city}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  errors.city ? "border-red-500" : ""
                }`}
                required
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={deliveryAddress.state}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.state ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={deliveryAddress.zip}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.zip ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={deliveryAddress.email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">
            Credit/Debit Card Payment
          </h2>
          <div className="space-y-4">
            {/* Payment Icons */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={visaLogo}
                alt="Visa"
                className="w-12 h-8 object-contain"
              />
              <img
                src={mastercardLogo}
                alt="Mastercard"
                className="w-12 h-8 object-contain"
              />
              <img
                src={troyLogo}
                alt="Troy"
                className="w-12 h-8 object-contain"
              />
              <img
                src={bkmExpressLogo}
                alt="BKM Express"
                className="w-12 h-8 object-contain"
              />
            </div>
            <div>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number (16 digits)"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                className={`w-full p-2 border rounded ${
                  errors.cardNumber ? "border-red-500" : ""
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="cardholderName"
                placeholder="Cardholder Name"
                value={cardDetails.cardholderName}
                onChange={handleCardInputChange}
                className={`w-full p-2 border rounded ${
                  errors.cardholderName ? "border-red-500" : ""
                }`}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cardholderName}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={handleCardInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.expiryDate ? "border-red-500" : ""
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV (3 digits)"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.cvv ? "border-red-500" : ""
                  }`}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-6">
            {cart.map((item) => (
              <li
                key={item.book_id}
                className="flex items-start justify-between"
              >
                {/* Book Thumbnail */}
                <img
                  src={item.image_url || "https://via.placeholder.com/50x75"}
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

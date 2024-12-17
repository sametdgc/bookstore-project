import React, { useState, useEffect } from "react";
import { fetchUser, getCartItems, placeOrder,decrementBookStock} from "../../services/api";
import {
  AddressSelector,
  PaymentForm,
  OrderSummary,
} from "../../components/checkoutPage";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


const CheckoutPage = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [cart, setCart] = useState([]);
  const [shippingCost, setShippingCost] = useState(10.0);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [email, setEmail] = useState("");

  // Verification modal state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [timeLeft, setTimeLeft] = useState(15);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      const user = await fetchUser();
      if (user) {
        const userId = user.user_metadata.custom_incremented_id;
        const dbCart = await getCartItems(userId);
        setCart(dbCart || []);
      } else {
        setCart([]);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    let timer;
    if (isVerificationModalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVerificationModalOpen, timeLeft]);

  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => total + item.book.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTotalPrice = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal + shippingCost).toFixed(2);
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

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "cardNumber":
        error = value.length !== 16 ? "Card number must be 16 digits." : "";
        break;
      case "cardholderName":
        error = value === "" ? "Cardholder name is required." : "";
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
        error = value === "" ? "This field is required." : "";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const validateFields = () => {
    let isValid = true;

    if (!validateField("email", email)) {
      isValid = false;
    }

    Object.keys(cardDetails).forEach((key) => {
      if (!validateField(key, cardDetails[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleConfirmOrder = () => {
    setGeneralError("");

    if (!selectedAddressId) {
      setGeneralError("Please select a delivery address.");
      return;
    }

    if (!validateFields()) {
      setGeneralError("Please fill in all required fields correctly.");
      return;
    }

    setIsVerificationModalOpen(true);
  };

  const handleVerificationInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="code-${index + 1}"]`
      );
      nextInput?.focus();
    }
  };

  const handleVerification = async () => {
    const code = verificationCode.join("");
    if (code.length === 6) {
      setIsVerificationModalOpen(false);

      // Continue with the original order placement logic
      try {
        const userId = Cookies.get("user_id");
        if (!userId) {
          setGeneralError("You must be logged in to place an order.");
          return;
        }

        const orderDetails = {
          user_id: userId,
          total_price: calculateTotalPrice(),
          order_date: new Date().toISOString(),
          address_id: selectedAddressId,
        };

        const orderResult = await placeOrder(orderDetails, cart);

        if (!orderResult.success) {
          if (orderResult.insufficientStockItems) {
            const stockMessage = orderResult.insufficientStockItems
              .map(
                (item) =>
                  `Book ID ${item.book_id} has only ${item.stock} items in stock.`
              )
              .join("\n");
            setGeneralError(`Stock issue:\n${stockMessage}`);
          } else {
            setGeneralError(
              orderResult.message || "Failed to place the order."
            );
          }
          return;
        }

        showProcessingAlert();
        setTimeout(() => {
          removeProcessingAlert();
          showSuccessAlert();
          const orderId = orderResult.data.order_id;
          navigate(`/invoice?orderID=${orderId}`);
        }, 2000);
      } catch (error) {
        console.error("Error during order placement:", error.message);
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } else {
      setGeneralError("Invalid verification code. Please try again.");
    }
  };

  const showProcessingAlert = () => {
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
  };

  const showSuccessAlert = () => {
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
  };

  const removeProcessingAlert = () => {
    const processingAlert = document.querySelector(".fixed");
    if (processingAlert && processingAlert.parentNode) {
      processingAlert.parentNode.removeChild(processingAlert);
    } else {
      console.warn("Processing alert not found or already removed.");
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-semibold text-[#65aa92] text-center mb-8">
        Checkout
      </h1>
      {generalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span>{generalError}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
          <AddressSelector
            userId={Cookies.get("user_id")}
            onAddressSelect={(addressId) => setSelectedAddressId(addressId)}
          />
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-4 mt-4">
            Credit/Debit Card Payment
          </h2>
          <PaymentForm
            cardDetails={cardDetails}
            errors={errors}
            onInputChange={handleCardInputChange}
          />
        </div>
        <OrderSummary
          cart={cart}
          shippingCost={shippingCost}
          calculateTotalPrice={calculateTotalPrice}
        />
      </div>
      <div className="text-center mt-8">
        <button
          onClick={handleConfirmOrder}
          className="px-6 py-3 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b]"
        >
          Confirm Your Order
        </button>
      </div>

      {isVerificationModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-sm w-full">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-lg font-semibold">Security Code</h2>
              <p className="text-sm text-gray-500">
                Enter the 6-digit code sent to your phone.
              </p>
              <div className="flex gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`code-${index}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleVerificationInputChange(index, e.target.value)
                    }
                    className="h-12 w-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#65aa92]"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Time remaining: {timeLeft}s
                </p>
                <button
                  className="text-sm text-[#65aa92] hover:underline"
                  disabled={timeLeft > 0}
                  onClick={() => setTimeLeft(15)}
                >
                  Resend Code
                </button>
              </div>
              <button
                className="w-full px-6 py-3 bg-[#65aa92] text-white font-semibold rounded shadow hover:bg-[#579d7b]"
                onClick={handleVerification}
                disabled={verificationCode.some((digit) => !digit)}
              >
                Verify and Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

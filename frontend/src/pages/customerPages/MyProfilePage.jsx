import React, { useEffect, useState } from "react";
import {
  getUserData,
  getUserOrders,
  fetchUser,
  updateUserData,
} from "../../services/api";
import AddressesWindow from "../../components/profilePage/AddressesWindow";
import PersonalDetailsWindow from "../../components/profilePage/PersonalDetailsWindow";
import OrderDetailsWindow from "../../components/profilePage/OrderDetailsWindow";
import { Link } from "react-router-dom";
import { User, Book, ShoppingBag, Clipboard, Truck, Home } from "lucide-react"; // Icons

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Fetch user profile and order data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const authUser = await fetchUser();
        if (!authUser) {
          setUser(null);
          return;
        }

        setUser(authUser);

        const basicData = await getUserData();
        setUserData(basicData);

        const orderData = await getUserOrders();
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#65aa92]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <Link
            to="/login"
            className="bg-[#65aa92] text-white font-semibold py-2 px-4 rounded hover:bg-[#4a886e] transition duration-300"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <p className="mt-2 text-xl text-gray-600">
            Manage your account and view your orders
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "personal"
                  ? "bg-[#65aa92] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <User className="inline-block mr-2" size={20} />
              Personal Details
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "addresses"
                  ? "bg-[#65aa92] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("addresses")}
            >
              <Book className="inline-block mr-2" size={20} />
              Addresses
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "orders"
                  ? "bg-[#65aa92] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="inline-block mr-2 text-6xl" size={20} />
              Order History
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Personal Details */}
            {activeTab === "personal" && (
              <PersonalDetailsWindow
                userData={userData}
                userEmail={user?.email}
                isEditing={isEditing}
                onSaveChanges={(updatedData) => {
                  updateUserData(updatedData);
                  setUserData(updatedData);
                  setIsEditing(false);
                }}
                onEditToggle={() => setIsEditing(!isEditing)}
                onCancel={() => setIsEditing(false)}
              />
            )}

            {/* Addresses */}
            {activeTab === "addresses" && (
              <AddressesWindow
                userId={user?.user_metadata?.custom_incremented_id}
              />
            )}

            {/* Order History */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">
                  Order History
                </h2>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300"
                    >
                      <div className="flex justify-between items-center">
                        {/* Order ID and Date */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            <Link
                              to={`/invoice?orderID=${order.order_id}`}
                              className="text-[#65aa92] hover:underline text-2xl"
                            >
                              Order #{order.order_id}
                            </Link>
                          </h3>
                          <span className="text-sm font-medium text-gray-600">
                            {new Date(order.order_date).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Delivery Status Icons */}
                        <div className="flex items-center ml-auto mr-6">
                          {order.delivery_status?.status.toLowerCase() ===
                          "cancelled" ? (
                            // Cancelled Status
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white">
                                <span className="font-semibold text-lg">X</span>{" "}
                                {/* Red X Icon */}
                              </div>
                              <span className="ml-4 text-red-500 font-medium text-lg">
                                Order Cancelled
                              </span>
                            </div>
                          ) : (
                            // Regular Status Progress
                            ["Processing", "In Transit", "Delivered"].map(
                              (step, index) => {
                                const currentStatus =
                                  order.delivery_status?.status.toLowerCase() ||
                                  "processing";

                                const isCompleted =
                                  (currentStatus === "processing" &&
                                    index === 0) ||
                                  (currentStatus === "in-transit" &&
                                    index <= 1) ||
                                  currentStatus === "delivered";

                                const connectorCompleted =
                                  (currentStatus === "in-transit" &&
                                    index === 0) ||
                                  currentStatus === "delivered";

                                return (
                                  <div key={step} className="flex items-center">
                                    <div
                                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        isCompleted
                                          ? "bg-[#65aa92] text-white"
                                          : "bg-gray-300 text-gray-700"
                                      }`}
                                    >
                                      {index === 0 ? (
                                        <Clipboard size={20} />
                                      ) : index === 1 ? (
                                        <Truck size={20} />
                                      ) : (
                                        <Home size={20} />
                                      )}
                                    </div>

                                    {/* Connector */}
                                    {index < 2 && (
                                      <div
                                        className={`h-1 ${
                                          connectorCompleted
                                            ? "bg-[#65aa92]"
                                            : "bg-gray-300"
                                        }`}
                                        style={{ width: "160px" }}
                                      />
                                    )}
                                  </div>
                                );
                              }
                            )
                          )}
                        </div>
                      </div>

                      {/* Total Price and Address */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Price</p>
                          <p className="text-lg font-semibold text-[#65aa92]">
                            ${order.total_price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Delivery Address
                          </p>
                          <p className="text-sm text-gray-800">
                            {order.address
                              ? `${order.address.address_details}, ${order.address.city}, ${order.address.district}`
                              : "Address not available"}
                          </p>
                        </div>
                      </div>

                      {/* OrderDetailsWindow */}
                      <OrderDetailsWindow order={order} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">
                    No orders have been placed yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;

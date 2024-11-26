import React, { useEffect, useState } from "react";
import {
  getUserData,
  getUserOrders,
  fetchUser,
  updateUserData,
} from "../services/api";
import AddressesWindow from "../components/profilePage/AddressesWindow";
import PersonalDetailsWindow from "../components/profilePage/PersonalDetailsWindow";
import { Link } from "react-router-dom";
import { User, Book, ShoppingBag } from "lucide-react";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

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

  const handleSaveChanges = async (updatedData) => {
    await updateUserData(updatedData);
    setUserData(updatedData);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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
              <ShoppingBag className="inline-block mr-2" size={20} />
              Order History
            </button>
          </div>

          <div className="p-6">
            {activeTab === "personal" && (
              <PersonalDetailsWindow
                userData={userData}
                userEmail={user?.email}
                isEditing={isEditing}
                onSaveChanges={handleSaveChanges}
                onEditToggle={handleEditToggle}
                onCancel={handleEditToggle}
              />
            )}

            {activeTab === "addresses" && (
              <AddressesWindow
                userId={user?.user_metadata?.custom_incremented_id}
              />
            )}

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
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.order_id}
                        </h3>
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(order.order_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
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
                            {order.address ? (
                              <>
                                {order.address.city}, {order.address.district}
                                <br />
                                {order.address.address_details}
                              </>
                            ) : (
                              "Address not available"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No orders
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't placed any orders yet.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/books"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#65aa92] hover:bg-[#4a886e]"
                      >
                        Start shopping
                      </Link>
                    </div>
                  </div>
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

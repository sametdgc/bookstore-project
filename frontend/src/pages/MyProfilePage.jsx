import React, { useEffect, useState } from "react";
import { getUserData, getUserAddresses, getUserOrders, fetchUser } from "../services/api";
import { Link } from "react-router-dom";

const MyProfilePage = () => {
  const [user, setUser] = useState(null); // Authenticated user
  const [userData, setUserData] = useState(null); // User details from the database
  const [addresses, setAddresses] = useState([]); // User addresses
  const [orders, setOrders] = useState([]); // User orders
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // fetch authenticated user
        const authUser = await fetchUser();
        if (!authUser) {
          setUser(null);
          return;
        }
        setUser(authUser);

        // fetch user data from the database
        const basicData = await getUserData();
        setUserData(basicData);
        const addressData = await getUserAddresses();
        setAddresses(addressData);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If the user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>
          Please <Link to="/login" className="text-blue-500">log in</Link> to view your profile.
        </p>
      </div>
    );
  }

  // Profile page content
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
      </div>

      <div className="container mx-auto space-y-12">
        {/* Personal Information Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Labels */}
            <div className="space-y-4 text-gray-700 font-semibold">
              <p>Full Name:</p>
              <p>Email:</p>
              <p>Phone Number:</p>
              <p>Tax ID:</p>
            </div>
            {/* Values */}
            <div className="space-y-4 text-gray-700">
              <p>{userData?.full_name || "N/A"}</p>
              <p>{user?.email || "N/A"}</p>
              <p>{userData?.phone_number || "N/A"}</p>
              <p>{userData?.tax_id || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Saved Addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.length > 0 ? (
              addresses.map((ua, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#65aa92] mb-2">{ua.address_title}</h3>
                  <p className="text-gray-700"><strong>City:</strong> {ua.address.city}</p>
                  <p className="text-gray-700"><strong>District:</strong> {ua.address.district}</p>
                  <p className="text-gray-700"><strong>Details:</strong> {ua.address.address_details}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No saved addresses.</p>
            )}
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#65aa92] mb-4">Order History</h2>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.order_id} className="p-4 border rounded-md bg-gray-50 shadow-sm">
                  <p className="text-gray-700"><strong>Order ID:</strong> {order.order_id}</p>
                  <p className="text-gray-700"><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                  <p className="text-gray-700"><strong>Total Price:</strong> ${order.total_price.toFixed(2)}</p>
                  <p className="text-gray-700">
                    <strong>Delivery Address:</strong> 
                    {order.address ? (
                      <>
                        <span> {order.address.city}, {order.address.district}</span>
                        <span> - {order.address.address_details}</span>
                      </>
                    ) : (
                      <span> Address not available</span>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No order history.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;

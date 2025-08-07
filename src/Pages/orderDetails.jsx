import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiTruck, FiCreditCard, FiMapPin } from "react-icons/fi";

const baseUrl = process.env.REACT_APP_BASEURL;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === 'true';
    setDarkMode(savedDarkMode);
    
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const res = await axios.get(`${baseUrl}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data);
      } catch (err) {
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Theme variables
  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = darkMode ? 'bg-gray-700' : 'bg-white';
  const buttonStyle = "bg-black text-white px-4 py-3 rounded-md font-bold uppercase text-sm tracking-wide hover:bg-pink-600 hover:shadow-lg transition-all flex items-center";

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
        <p className={`mt-4 text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
          Loading Order Details
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className={`text-xl font-extrabold uppercase tracking-tight mt-4 ${textColor}`}>
          Error Loading Order
        </h2>
        <p className={`mt-2 text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
          {error}
        </p>
        <Link 
          to="/orders" 
          className={`mt-6 ${buttonStyle} inline-flex items-center`}
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </Link>
      </div>
    </div>
  );
  
  if (!order) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className={`text-xl font-extrabold uppercase tracking-tight mt-4 ${textColor}`}>
          Order Not Found
        </h2>
        <p className={`mt-2 text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
          The requested order could not be found
        </p>
        <Link 
          to="/orders" 
          className={`mt-6 ${buttonStyle} inline-flex items-center`}
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link 
              to="/orders" 
              className={`flex items-center text-sm font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
            >
              <FiArrowLeft className="mr-2" /> BACK TO ORDERS
            </Link>
            <h1 className={`text-2xl font-extrabold uppercase tracking-tight mt-2 ${textColor}`}>
              ORDER #{order.order_id}
            </h1>
            <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
              PLACED ON {new Date(order.date_placed).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }).toUpperCase()}
            </p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-md ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            } text-xs font-bold uppercase tracking-wide`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? 'LIGHT' : 'DARK'}
          </button>
        </header>

        {/* Order Status Card */}
        <div className={`rounded-md shadow-lg p-6 mb-8 border ${borderColor} ${cardBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-r border-gray-300 pr-6">
              <div className="flex items-center">
                <FiTruck className={`w-6 h-6 mr-3 ${textMuted}`} />
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>STATUS</p>
                  <span className={`text-base font-bold mt-1 ${
                    order.status === "Delivered"
                      ? "text-green-500"
                      : order.status === "Processing"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-r border-gray-300 pr-6">
              <div className="flex items-center">
                <FiCreditCard className={`w-6 h-6 mr-3 ${textMuted}`} />
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>PAYMENT</p>
                  <p className={`text-base font-bold mt-1 ${textColor}`}>
                    {order.payment_method?.toUpperCase() || 'CREDIT CARD'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center">
                <FiMapPin className={`w-6 h-6 mr-3 ${textMuted}`} />
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>SHIPPING</p>
                  <p className={`text-base font-bold mt-1 ${textColor}`}>
                    {order.shipping_address?.city ? `${order.shipping_address.city.toUpperCase()}` : 'STANDARD'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <div className={`rounded-md shadow-lg p-6 border ${borderColor} ${cardBg}`}>
              <h2 className={`text-xl font-extrabold uppercase tracking-tight mb-6 ${textColor}`}>
                ORDER ITEMS
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <motion.div
                    key={item.order_item_id}
                    className={`flex items-center justify-between rounded-md p-4 border ${borderColor} ${cardBg}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Left: Image + Details */}
                    <div className="flex items-center">
                      <img
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.title}
                        className="w-16 h-16 rounded-md object-contain bg-gray-100 p-1"
                      />
                      <div className="ml-4">
                        <p className={`text-sm font-bold uppercase tracking-wide ${textColor}`}>
                          {item.title.toUpperCase()}
                        </p>
                        <p className={`text-xs font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
                          QUANTITY: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right">
                      <p className={`text-sm font-bold ${textColor}`}>
                        ₹ {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${textMuted}`}>
                        ₹ {item.price.toLocaleString()} EACH
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-8 border-t pt-6 flex justify-between">
                <p className={`text-lg font-extrabold uppercase tracking-tight ${textColor}`}>
                  TOTAL
                </p>
                <p className={`text-lg font-extrabold ${textColor}`}>
                  ₹ {order.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Shipping Address */}
            <div className={`rounded-md shadow-lg p-6 border ${borderColor} ${cardBg}`}>
              <h2 className={`text-xl font-extrabold uppercase tracking-tight mb-4 ${textColor}`}>
                SHIPPING ADDRESS
              </h2>
              
              {order.shipping_address ? (
                <div>
                  <p className={`font-bold uppercase tracking-wide ${textColor}`}>
                    {order.shipping_address.full_name?.toUpperCase()}
                  </p>
                  <p className={`text-sm font-semibold uppercase tracking-wide mt-2 ${textColor}`}>
                    {order.shipping_address.address_line1?.toUpperCase()}
                  </p>
                  {order.shipping_address.address_line2 && (
                    <p className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}>
                      {order.shipping_address.address_line2.toUpperCase()}
                    </p>
                  )}
                  <p className={`text-sm font-semibold uppercase tracking-wide mt-2 ${textMuted}`}>
                    {order.shipping_address.city?.toUpperCase()}, {order.shipping_address.state?.toUpperCase()} {order.shipping_address.zip}
                  </p>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
                    {order.shipping_address.country?.toUpperCase()}
                  </p>
                  {order.shipping_address.mobile && (
                    <p className={`text-sm font-semibold uppercase tracking-wide mt-2 ${textMuted}`}>
                      MOBILE: {order.shipping_address.mobile}
                    </p>
                  )}
                </div>
              ) : (
                <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
                  NO SHIPPING ADDRESS PROVIDED
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className={`rounded-md shadow-lg p-6 border ${borderColor} ${cardBg}`}>
              <h2 className={`text-xl font-extrabold uppercase tracking-tight mb-4 ${textColor}`}>
                PAYMENT METHOD
              </h2>
              
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-md p-2 mr-4">
                  <FiCreditCard className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wide ${textColor}`}>
                    {order.payment_method?.toUpperCase() || 'CREDIT CARD'}
                  </p>
                  {order.payment_details?.last4 && (
                    <p className={`text-xs font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
                      Ending in •••• {order.payment_details.last4}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
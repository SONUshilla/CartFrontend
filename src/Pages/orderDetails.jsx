import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft, FiTruck, FiCreditCard, FiMapPin, FiCalendar, FiPackage, FiDollarSign, FiUser } from "react-icons/fi";

const baseUrl = process.env.REACT_APP_BASEURL;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipping_address, setShippingAddress] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const res = await axios.get(`${baseUrl}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data.order);
        setShippingAddress(res.data.shipping_address);
      } catch (err) {
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Theme variables for sharp, edgy design
  const bgColor = 'bg-white';
  const textColor = 'text-gray-900';
  const textMuted = 'text-gray-500';
  const borderColor = 'border-gray-300';
  const cardBg = 'bg-white';
  const accentColor = 'border-black text-black';

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${textMuted}`}>
          LOADING ORDER DETAILS
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-none border-2 border-black flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className={`text-xl font-bold uppercase tracking-widest mt-4 ${textColor}`}>
          ERROR LOADING ORDER
        </h2>
        <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
          {error}
        </p>
        <Link 
          to="/orders" 
          className={`mt-6 bg-black text-white px-5 py-3 rounded-none font-bold uppercase text-xs tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center w-48 mx-auto`}
        >
          <FiArrowLeft className="mr-2" /> BACK TO ORDERS
        </Link>
      </div>
    </div>
  );
  
  if (!order) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-none border-2 border-black flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className={`text-xl font-bold uppercase tracking-widest mt-4 ${textColor}`}>
          ORDER NOT FOUND
        </h2>
        <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
          THE REQUESTED ORDER COULD NOT BE FOUND
        </p>
        <Link 
          to="/orders" 
          className={`mt-6 bg-black text-white px-5 py-3 rounded-none font-bold uppercase text-xs tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center w-48 mx-auto`}
        >
          <FiArrowLeft className="mr-2" /> BACK TO ORDERS
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center border-b border-black pb-4 mb-4">
            <Link
                to={{ pathname: "/cart" }}
                state={{ active: "orders" }}
              className={`flex items-center text-xs font-bold uppercase tracking-widest ${textMuted} hover:text-black transition-all`}
            >
              <FiArrowLeft className="mr-2" /> BACK TO ORDERS
            </Link>
            <div className="text-right">
              <p
                className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}
              >
                ORDER ID
              </p>
              <h1
                className={`text-2xl font-bold uppercase tracking-widest mt-1 ${textColor}`}
              >
                #{order.order_id}
              </h1>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}
              >
                ORDER DATE
              </p>
              <p
                className={`text-sm font-bold uppercase tracking-widest mt-1 ${textColor}`}
              >
                {new Date(order.date_placed)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </p>
            </div>

            <div
              className={`px-4 py-2 border-2 border-black text-xs font-bold uppercase tracking-widest ${
                order.status === "Delivered"
                  ? "bg-black text-white"
                  : order.status === "Processing"
                  ? "bg-gray-100 text-black"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {order.status.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className={`border-2 border-black p-4 ${cardBg} flex items-center`}
          >
            <FiTruck className="w-6 h-6 mr-4 text-black" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                SHIPPING TO
              </p>
              <p className="text-sm font-bold uppercase tracking-wider mt-1">
                {shipping_address?.city
                  ? `${shipping_address.city.toUpperCase()}`
                  : "STANDARD"}
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className={`border-2 border-black p-4 ${cardBg} flex items-center`}
          >
            <FiCreditCard className="w-6 h-6 mr-4 text-black" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                PAYMENT METHOD
              </p>
              <p className="text-sm font-bold uppercase tracking-wider mt-1">
                {order.payment_method?.toUpperCase() || "CREDIT CARD"}
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className={`border-2 border-black p-4 ${cardBg} flex items-center`}
          >
            <FiDollarSign className="w-6 h-6 mr-4 text-black" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                TOTAL AMOUNT
              </p>
              <p className="text-sm font-bold uppercase tracking-wider mt-1">
                ₹ {order.total.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
        <div className={`border-2 border-black p-6 ${cardBg} md:hidden mb-4`}>
          <div className="flex items-center border-b border-black pb-4 mb-4">
            <FiCalendar className="w-5 h-5 mr-2 text-black" />
            <h2
              className={`text-lg font-bold uppercase tracking-widest ${textColor}`}
            >
              ORDER TIMELINE
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 bg-black rounded-none"></div>
                <div className="w-0.5 h-full bg-black mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">
                  ORDER PLACED
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
                  {new Date(order.date_placed)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 bg-black rounded-none"></div>
                <div className="w-0.5 h-full bg-black mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">
                  ORDER CONFIRMED
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
                  {new Date(order.date_placed)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 bg-black rounded-none"></div>
                <div className="w-0.5 h-full bg-black mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">
                  SHIPPED
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
                  {order.status === "Delivered"
                    ? new Date(order.date_placed)
                        .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        .toUpperCase()
                    : "PENDING"}
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 bg-black rounded-none"></div>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">
                  {order.status === "Delivered"
                    ? "DELIVERED"
                    : "ESTIMATED DELIVERY"}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
                  {order.status === "Delivered"
                    ? new Date(order.date_placed)
                        .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        .toUpperCase()
                    : "OCT 28, 2023"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Order Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            <div className={`border-2 border-black p-6 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-black pb-4 mb-6">
                <h2
                  className={`text-lg font-bold uppercase tracking-widest ${textColor}`}
                >
                  ORDER ITEMS
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {order.items.length} ITEMS
                </p>
              </div>

              <div className="space-y-6">
                {order.items.map((item) => (
                  <motion.div
                    key={item.order_item_id}
                    className={`flex items-center justify-between py-4 border-b border-gray-200 last:border-0`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex">
                      <div className="relative">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.title}
                          className="w-20 h-20 object-contain bg-gray-50 border border-gray-300"
                        />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="ml-4 flex justify-start flex-col items-start">
                        <p
                          className={`text-sm font-bold uppercase tracking-wider ${textColor}`}
                        >
                          {item.title.slice(0, 40).toUpperCase()}
                        </p>
                        <p
                          className={`text-xs font-semibold uppercase tracking-widest mt-1 ${textMuted}`}
                        >
                          SKU: {item.sku || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-bold ${textColor}`}>
                        ₹ {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p
                        className={`text-xs font-semibold uppercase tracking-widest ${textMuted}`}
                      >
                        ₹ {item.price.toLocaleString()} EACH
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-8 pt-6 flex justify-between border-t border-black">
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}
                  >
                    SUBTOTAL
                  </p>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mt-2 ${textMuted}`}
                  >
                    SHIPPING
                  </p>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mt-2 ${textMuted}`}
                  >
                    TAX
                  </p>
                  <p
                    className={`text-lg font-bold uppercase tracking-widest mt-4 ${textColor}`}
                  >
                    TOTAL
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${textColor}`}>
                    ₹ {(order.total * 0.85).toLocaleString()}
                  </p>
                  <p className={`text-xs font-bold mt-2 ${textColor}`}>
                    ₹ {(order.total * 0.1).toLocaleString()}
                  </p>
                  <p className={`text-xs font-bold mt-2 ${textColor}`}>
                    ₹ {(order.total * 0.05).toLocaleString()}
                  </p>
                  <p className={`text-lg font-bold mt-4 ${textColor}`}>
                    ₹ {order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="lg:col-span-1 space-y-6 hidden md:block">
            {/* Order Timeline Card with Progress Indicator */}
            <div className={`border-2 border-black p-6 ${cardBg}`}>
              <div className="flex items-center border-b border-black pb-4 mb-4">
                <FiCalendar className="w-5 h-5 mr-2 text-black" />
                <h2
                  className={`text-lg font-bold uppercase tracking-widest ${textColor}`}
                >
                  ORDER TIMELINE
                </h2>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Started</span>
                  <span>Completed</span>
                </div>
                <div className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      order.status === "Delivered"
                        ? "bg-green-600"
                        : order.status === "Shipped"
                        ? "bg-blue-600 w-2/3"
                        : "bg-black w-1/3"
                    }`}
                    style={{
                      width:
                        order.status === "Delivered"
                          ? "100%"
                          : order.status === "Shipped"
                          ? "66%"
                          : "33%",
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-right text-xs font-bold">
                  {order.status === "Delivered"
                    ? "100% Complete"
                    : order.status === "Shipped"
                    ? "66% Complete"
                    : "33% Complete"}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "ORDER PLACED",
                    date: order.date_placed,
                    completed: true,
                  },
                  {
                    title: "ORDER CONFIRMED",
                    date: order.date_placed,
                    completed: order.status !== "Placed",
                  },
                  {
                    title: "SHIPPED",
                    date: order.date_placed,
                    completed:
                      order.status === "Shipped" ||
                      order.status === "Delivered",
                  },
                  {
                    title:
                      order.status === "Delivered"
                        ? "DELIVERED"
                        : "ESTIMATED DELIVERY",
                    date:
                      order.status === "Delivered"
                        ? order.date_placed
                        : "OCT 28, 2023",
                    completed: order.status === "Delivered",
                  },
                ].map((step, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const statusClass = step.completed
                    ? "bg-black"
                    : "bg-gray-300";

                  return (
                    <div className="flex" key={index}>
                      <div className="flex flex-col items-center mr-3">
                        <div
                          className={`w-3 h-3 rounded-full ${statusClass}`}
                        ></div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-full mt-1 ${statusClass}`}
                          ></div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold uppercase tracking-wide ${
                            step.completed ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                          {step.completed && (
                            <span className="ml-2 text-xs text-green-600">
                              ✓ Completed
                            </span>
                          )}
                        </p>
                        <p
                          className={`text-xs font-bold uppercase tracking-widest mt-1 ${
                            step.completed ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {step.completed
                            ? new Date(step.date)
                                .toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                                .toUpperCase()
                            : step.title === "ESTIMATED DELIVERY"
                            ? step.date
                            : "PENDING"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
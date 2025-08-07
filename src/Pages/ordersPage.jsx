import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronRight, FiCalendar } from "react-icons/fi";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASEURL;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const res = await axios.get(`${baseUrl}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        const formattedOrders = data.map(order => {
          const firstItem = order.items[0];
          const extraItems = order.items.length > 1 ? order.items.length - 1 : 0;

          return {
            id: order.order_id,
            date: order.date_placed,
            image: firstItem?.image || "https://via.placeholder.com/80",
            title: firstItem?.title || "No title",
            extraItems,
            price: order.total,
            status: order.status.toUpperCase(),
          };
        });

        setOrders(formattedOrders);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusClasses = {
    DELIVERED: "bg-gray-900 text-white",
    PROCESSING: "bg-gray-200 text-gray-900",
    "IN PROGRESS": "bg-gray-200 text-gray-900",
    CANCELLED: "bg-gray-200 text-gray-900",
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="text-center mt-20 text-sm font-bold uppercase tracking-wide">LOADING...</div>;
  if (error) return <div className="text-center text-red-500 mt-20 text-sm font-bold uppercase tracking-wide">ERROR: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-gray-900 mb-6">
            MY ORDERS
          </h1>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-6">
            <div className="flex space-x-2 mb-4 md:mb-0">
              {["ALL", "PROCESSING", "DELIVERED", "CANCELLED"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  aria-label={`Filter by ${tab}`}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border ${
                    filter === tab
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:shadow-md transition-all duration-300 ease-out"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              className="flex items-center px-3 py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider hover:shadow-md transition-all duration-300 ease-out"
              aria-label="Select date range"
            >
              <FiCalendar className="mr-2" />
              DATE RANGE
            </button>
          </div>
        </header>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 p-4 bg-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-out"
            >
              <Link 
                to={`/orders/${order.id}`} 
                className="flex flex-col md:flex-row md:items-center justify-between"
                aria-label={`View order ${order.id}`}
              >
                {/* Mobile: Image on top */}
                <div className="md:hidden mb-4">
                  <img
                    src={order.image}
                    alt={order.title}
                    className="w-full h-40 object-cover border border-gray-200"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:space-x-6 w-full">
                  {/* Desktop: Image left */}
                  <div className="hidden md:block">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-20 h-20 object-cover border border-gray-200"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-2 md:mb-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                          ORDER #{order.id}
                        </p>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-1">
                          {order.title}
                        </h3>
                        {order.extraItems > 0 && (
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            + {order.extraItems} MORE ITEMS
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-start md:items-end">
                        <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide mb-2 ${statusClasses[order.status] || "bg-gray-200 text-gray-900"}`}>
                          {order.status}
                        </span>
                        <p className="text-sm font-bold text-gray-900">
                          ₹{order.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:flex ml-6">
                  <FiChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
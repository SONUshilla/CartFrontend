import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronRight, FiCalendar } from "react-icons/fi";
import axios from "axios";
import { FiTrash2, FiPlus, FiMinus, FiLock, FiRefreshCw } from "react-icons/fi";
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
    DELIVERED: "bg-black text-white",
    PROCESSING: "bg-gray-100 text-gray-900 border border-gray-900",
    "IN PROGRESS": "bg-gray-100 text-gray-900 border border-gray-900",
    CANCELLED: "bg-gray-100 text-gray-500 border border-gray-300",
  };

  const filteredOrders = filter === "ALL" ? orders : orders.filter(o => o.status === filter);
  const bgColor = 'bg-white';
  const textColor = 'text-gray-900';
  const textMuted = 'text-gray-500';
  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${textMuted}`}>
          LOADING ORDER
        </p>
      </div>
    </div>
  );
  if (error) return <div className="text-center text-red-500 mt-20 text-xs font-bold uppercase tracking-widest">ERROR: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-4 border-b border-gray-900 pb-2">
            ORDER HISTORY
          </h1>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-300 pb-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {["ALL", "PROCESSING", "DELIVERED", "CANCELLED"].map(tab => (
                <motion.button
                  key={tab}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(tab)}
                  aria-label={`Filter by ${tab}`}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-none ${
                    filter === tab
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-900"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 border border-gray-300 text-xs font-bold uppercase tracking-widest rounded-none hover:bg-gray-50 hover:border-gray-900"
              aria-label="Select date range"
            >
              <FiCalendar className="mr-2" />
              DATE RANGE
            </motion.button>
          </div>
        </header>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                borderColor: "#000",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)"
              }}
              transition={{ duration: 0.2 }}
              className="border border-gray-300 p-4 bg-white rounded-none"
            >
              <Link 
                to={`/orders/${order.id}`} 
                className="block"
                aria-label={`View order ${order.id}`}
              >
                {/* Top row - Order ID and Date/Status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex justify-start gap-10 items-start">
              
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClasses[order.status] || "bg-gray-100 text-gray-900"}`}>
                      {order.status}
                    </span>
                    <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      {new Date(order.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-900">
                    ORDER #{order.id}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  {/* Mobile: Image top */}
                  <div className="md:hidden mb-3">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-full h-40 object-cover border border-gray-300 rounded-none"
                    />
                  </div>

                  {/* Desktop: Image left */}
                  <div className="hidden md:block">
                    <img
                      src={order.image}
                      alt={order.title.slice(1,50)}
                      className="w-16 h-16 object-cover border border-gray-300 rounded-none"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-2 md:mb-0">
                        <div className="flex flex-wrap items-baseline">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mr-2">
                            {order.title}
                          </h3>
                          {order.extraItems > 0 && (
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              + {order.extraItems} ITEMS
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <p className="text-sm font-bold text-gray-900 mr-3">
                          ${order.price.toLocaleString()}
                        </p>
                        <FiChevronRight className="text-gray-400 hidden md:block" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
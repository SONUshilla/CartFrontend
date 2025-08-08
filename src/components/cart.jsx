import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import setUpAxios from "./setUpAxios";
import { FiTrash2, FiPlus, FiMinus, FiLock, FiRefreshCw } from "react-icons/fi";
import OrderDetailsPage from "../Pages/orderDetails";
import OrdersPage from "../Pages/ordersPage";

const Cart = () => {
  const [isLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const baseUrl = process.env.REACT_APP_BASEURL;
  const [activeTab, setActiveTab] = useState("cart"); 
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  const location=useLocation();

  useEffect(() => {
    if (location?.state?.active) {
      setActiveTab(location.state.active);
    }
    console.log(location.state);
  }, [location]);
  

  const updateQuantity = useCallback((index, newQuantity) => {
    setCartItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  }, []);

  const deleteItem = async (index) => {
    const itemToDelete = cartItems[index];
    setIsLoading(true);

    try {
      if (isLoggedIn) {
        setUpAxios();
        await axios.post(
          `${baseUrl}/cart/delete`, 
          { name: itemToDelete.name },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      
      setCartItems(prev => prev.filter((_, i) => i !== index));
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to remove item. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      if (isLoggedIn) {
        setIsLoading(true);
        try {
          setUpAxios();
          const response = await axios.get(`${baseUrl}/getCart`);
          setCartItems(response.data);
        } catch (error) {
          console.error("Error fetching cart items:", error);
          setError("Failed to load cart items");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCart();
  }, [isLoggedIn, baseUrl]);

  const handleCheckout = () => {
    navigate("/checkOut", { state: { products: cartItems } });
  };

  const getTotalPrice = useCallback(() => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  , [cartItems]);

  const applyPromoCode = () => {
    if (promoCode.trim() === "") return;
    
    // Sample promo logic
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo({
        code: "SAVE10",
        discount: 0.1,
        message: "10% discount applied!"
      });
    } else {
      setError("Invalid promo code");
      setTimeout(() => setError(null), 3000);
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    return getTotalPrice() * appliedPromo.discount;
  };

  const calculateFinalTotal = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    const tax = (subtotal - discount) * 0.08;
    return (subtotal - discount + tax).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center ">
        <div className="text-center">
          <FiRefreshCw className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans ">
           <div className="flex mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("cart")}
            className={`px-6 py-3 text-lg font-semibold ${
              activeTab === "cart"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Cart
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 text-lg font-semibold ${
              activeTab === "orders"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Your Orders
          </button>
        </div>
      {activeTab === "cart" && (<div className="max-w-5xl mx-auto">
    

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  relative ">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.product_id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className=" bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-5 flex flex-col sm:flex-row relative">
                      {/* Product image */}
                      <div className="flex-shrink-0 bg-white mb-4 sm:mb-0 sm:mr-6 w-full sm:w-32 h-32 rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-gray-900 uppercase tracking-tight mb-1 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 shadow-sm inline-block">
                              ${item.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.color && (
                            <span className="text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300 shadow-sm">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300 shadow-sm">
                              {item.size}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                updateQuantity(index, item.quantity - 1)
                              }
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <FiMinus className="h-4 w-4" />
                            </motion.button>

                            <input
                              type="tel"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  index,
                                  parseInt(e.target.value || 1)
                                )
                              }
                              className="border-none w-12 h-9 text-center text-sm font-semibold text-gray-900 bg-white border-l border-r border-gray-300 outline-none"
                            />

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                updateQuantity(index, item.quantity + 1)
                              }
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <FiPlus className="h-4 w-4" />
                            </motion.button>
                          </div>

                          <button
                            onClick={() => deleteItem(index)}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 border border-red-100 bg-red-50 px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm"
                          >
                            <FiTrash2 className="h-4 w-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.code})</span>
                      <span className="font-medium">
                        -${calculateDiscount().toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">FREE</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">
                      $
                      {((getTotalPrice() - calculateDiscount()) * 0.08).toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ${calculateFinalTotal()}
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-3 bg-gray-800 text-white font-medium rounded-r-lg hover:bg-gray-700 transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-green-600 text-sm mt-1">
                      {appliedPromo.message}
                    </p>
                  )}
                </div>

                <button
                  className="px-4 py-2 text-sm font-medium w-full tracking-wide uppercase border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 relative overflow-hidden group"
                  onClick={handleCheckout}
                >
                  <span className="relative z-10">Proceed To chekout</span>
                  <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>)}
      {activeTab ==="orders" && (<OrdersPage/>)}
    </div>
  );
};

export default Cart;
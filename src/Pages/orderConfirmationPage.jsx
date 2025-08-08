// src/CheckoutFlow.js
import React, { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiArrowRight, FiArrowLeft, FiCreditCard, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from '../utils/scrollToTop';
import AddressSection from '../components/reusable/adressSection';
import { handleCheckout } from '../service/cartService';
const CheckoutFlow = () => {
  const [step, setStep] = useState(1); // 1: Address, 2: Review, 3: Payment
  const [darkMode, setDarkMode] = useState(false);

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const location =useLocation();
  const {products}=location.state || [];
  const [address,setSelectedAddress]=useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // New state for payment method
const navigate=useNavigate();

  // Save address to localStorage
  useEffect(() => {
    localStorage.setItem('checkoutAddress', JSON.stringify(address));
  }, [address]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  // Update product quantity
  const updateQuantity = (idx, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedProducts = [...products];
    updatedProducts[idx].quantity = newQuantity;
    // In a real app, you'd update state/context here
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = (subtotal + shipping) * 0.08;
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // Handle form submission
  const handleSubmit = async () => {
    setIsProcessing(true);
    const id = await handleCheckout(products, address, navigate, paymentMethod);
    if (id) {
      setIsProcessing(false);
      navigate(`/orders/${id}`);
    } else {
      setIsProcessing(false);
    }
  };
  
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-800" : "bg-white"
      } transition-colors duration-300 scroll-smooth`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-center items-center mb-12">
          <h1
            className={`text-xl font-extrabold uppercase tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            CHECKOUT
          </h1>
        </header>

        {/* Step Indicator */}
        <div className="flex justify-between mb-12 relative">
          {["ADDRESS", "REVIEW", "PAYMENT"].map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 flex items-center justify-center border ${
                    step >= index + 1
                      ? "bg-black text-white border-black"
                      : darkMode
                      ? "border-gray-600 text-gray-400"
                      : "border-gray-300 text-gray-500"
                  } font-bold text-sm transition-colors`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-semibold uppercase tracking-wide ${
                     step === index + 1
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`absolute top-5 left-1/4 right-1/4 h-0.5 ${
                    step > index + 1
                      ? "bg-black"
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {/* Address Step */}
              {step === 1 && (
                <motion.div
                  key="address"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`rounded-md shadow-lg p-6 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  } border`}
                >
                  <ScrollToTop />
                  <h2
                    className={`text-2xl font-extrabold uppercase tracking-tight mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    SHIPPING ADDRESS
                  </h2>
                  <AddressSection setAddress={setSelectedAddress} />

                  {address && (
                    <div className="relative mt-8 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        className="relative border-black border-2 overflow-hidden px-6 py-3 text-black hover:text-white font-bold uppercase text-sm tracking-wide flex items-center group"
                      >
                        <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
                        <span className="relative z-10 flex items-center">
                          CONTINUE <FiArrowRight className="ml-2" />
                        </span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Review Step */}
              {step === 2 && (
                <motion.div
                  key="review"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`rounded-md shadow-lg p-6 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  } border`}
                >
                  <ScrollToTop />
                  <h2
                    className={`text-2xl font-extrabold uppercase tracking-tight mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    REVIEW ITEMS
                  </h2>

                  <div className="space-y-4">
                    {products.map((product, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center border-b ${
                          darkMode ? "border-gray-600" : "border-gray-200"
                        } pb-4`}
                      >
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3
                            className={`text-sm font-bold uppercase tracking-wide ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {product.name}
                          </h3>
                          <p
                            className={`text-xs font-semibold uppercase tracking-wide ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Size: {product.size} | Color: {product.color}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateQuantity(idx, product.quantity - 1)
                                }
                                className={`w-8 h-8 flex items-center justify-center rounded-l-md border ${
                                  darkMode
                                    ? "border-gray-600 text-gray-300"
                                    : "border-gray-300 text-gray-700"
                                } hover:bg-gray-100 transition-colors`}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span
                                className={`w-10 text-center text-sm font-bold ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {product.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(idx, product.quantity + 1)
                                }
                                className={`w-8 h-8 flex items-center justify-center rounded-r-md border ${
                                  darkMode
                                    ? "border-gray-600 text-gray-300"
                                    : "border-gray-300 text-gray-700"
                                } hover:bg-gray-100 transition-colors`}
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                            <p
                              className={`text-sm font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className={`flex items-center px-4 py-2 font-bold uppercase text-sm tracking-wide ${
                        darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <FiArrowLeft className="mr-2" /> BACK
                    </button>
                    <button
                        onClick={() => setStep(3)}
                        className="relative border-black border-2 overflow-hidden px-6 py-3 text-black hover:text-white font-bold uppercase text-sm tracking-wide flex items-center group"
                      >
                        <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
                        <span className="relative z-10 flex items-center">
                          CONTINUE <FiArrowRight className="ml-2" />
                        </span>
                      </button>
                  </div>
                </motion.div>
              )}

              {/* Payment Step */}
              {step === 3 && (
                <motion.div
                  key="payment"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`rounded-sm shadow-lg p-6 ${
                    darkMode
                      ? "bg-gray-700 border-2 border-gray-600"
                      : "bg-white border-2 border-gray-200"
                  }`}
                >
                  <ScrollToTop />
                  <h2
                    className={`text-2xl font-extrabold uppercase tracking-tight mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    PAYMENT METHOD
                  </h2>

                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`px-4 py-2 border-2 font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
                          paymentMethod === 'card'
                            ? 'bg-black text-white border-black'
                            : darkMode
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Credit Card
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`px-4 py-2 border-2 font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
                          paymentMethod === 'cod'
                            ? 'bg-black text-white border-black'
                            : darkMode
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`px-4 py-2 border-2 font-bold uppercase text-sm tracking-wide transition-all duration-300 ${
                          paymentMethod === 'upi'
                            ? 'bg-black text-white border-black'
                            : darkMode
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        UPI
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <>
                        <div>
                          <label
                            className={`block text-sm font-semibold uppercase tracking-wide mb-1 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            CARD NUMBER
                          </label>
                          <div className="relative">
                            <FiCreditCard
                              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <input
                              type="text"
                              value={payment.cardNumber}
                              onChange={(e) =>
                                setPayment({
                                  ...payment,
                                  cardNumber: e.target.value,
                                })
                              }
                              className={`w-full pl-10 pr-4 py-3 rounded-sm border-2 text-sm font-bold uppercase ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-black focus:border-black"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black"
                              }`}
                              placeholder="0000 0000 0000 0000"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              className={`block text-sm font-semibold uppercase tracking-wide mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              EXPIRY DATE
                            </label>
                            <input
                              type="text"
                              value={payment.expiry}
                              onChange={(e) =>
                                setPayment({ ...payment, expiry: e.target.value })
                              }
                              className={`w-full px-4 py-3 rounded-sm border-2 text-sm font-bold uppercase ${
                                darkMode
                                  ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-black focus:border-black"
                                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black"
                              }`}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-semibold uppercase tracking-wide mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              CVV
                            </label>
                            <div className="relative">
                              <FiLock
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              />
                              <input
                                type="text"
                                value={payment.cvv}
                                onChange={(e) =>
                                  setPayment({ ...payment, cvv: e.target.value })
                                }
                                className={`w-full pl-10 pr-4 py-3 rounded-sm border-2 text-sm font-bold uppercase ${
                                  darkMode
                                    ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-black focus:border-black"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black"
                                }`}
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-semibold uppercase tracking-wide mb-1 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            CARDHOLDER NAME
                          </label>
                          <input
                            type="text"
                            value={payment.name}
                            onChange={(e) =>
                              setPayment({ ...payment, name: e.target.value })
                            }
                            className={`w-full px-4 py-3 rounded-sm border-2 text-sm font-bold uppercase ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-black focus:border-black"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black"
                            }`}
                            placeholder="JOHN DOE"
                          />
                        </div>
                      </>
                    )}

                    {/* Cash on Delivery Message */}
                    {paymentMethod === 'cod' && (
                      <div className={`p-4 border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Pay with cash when your order is delivered
                        </p>
                      </div>
                    )}

                    {/* UPI Payment Message */}
                    {paymentMethod === 'upi' && (
                      <div className={`p-4 border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          You'll be redirected to your UPI app for payment
                        </p>
                      </div>
                    )}

                    {/* Promo Code Section */}
                    <div>
                      <label
                        className={`block text-sm font-semibold uppercase tracking-wide mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        PROMO CODE
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className={`flex-1 px-4 py-3 rounded-l-sm border-2 text-sm font-bold uppercase ${
                            darkMode
                              ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-black focus:border-black"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black"
                          }`}
                          placeholder="ENTER CODE"
                        />
                        <button className={`border-2 border-l-0 ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-700' 
                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                        } px-4 py-3 rounded-r-sm font-bold uppercase text-sm tracking-wide transition-colors`}>
                          APPLY
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className={`flex items-center px-4 py-2 font-bold uppercase text-sm tracking-wide ${
                        darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <FiArrowLeft className="mr-2" /> BACK
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className={`relative border-2 border-black overflow-hidden px-8 py-3 font-bold uppercase text-sm tracking-wide flex items-center group transition-all duration-300 ${
                        isProcessing ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
                      <span className="relative z-10 flex items-center text-black group-hover:text-white">
                        {isProcessing ? (
                          "PROCESSING..."
                        ) : paymentMethod === 'cod' ? (
                          "PLACE ORDER"
                        ) : (
                          <>
                            PAY ${total} <FiArrowRight className="ml-2" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-md shadow-lg p-6 sticky top-24 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              } border`}
            >
              <h2
                className={`text-xl font-extrabold uppercase tracking-tight mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ORDER SUMMARY
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    SUBTOTAL
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    SHIPPING
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${shipping}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    TAX
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${tax}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-300 flex justify-between">
                  <span
                    className={`text-base font-extrabold uppercase tracking-tight ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    TOTAL
                  </span>
                  <span
                    className={`text-base font-extrabold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${total}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center">
                <FiLock
                  className={`mr-2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Your payment is securely encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Product from '../utils/product';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
const LandingPage = ({ products }) => {
  const mobileScrollRef = useRef(null);
  const laptopScrollRef = useRef(null);
  const [phones, setPhones] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (isHovered) return; // Stop auto-scroll on hover
  
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bestDeals.length);
    }, 5000); // Change every 5s
  
    return () => clearInterval(interval);
  }, [isHovered, bestDeals.length]);
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASEURL}/highlights`);

        setPhones(res.data.phones);
        setLaptops(res.data.laptops);
        setBestDeals(res.data.bestDeals);

        // Convert categories object to array for grid rendering
        const categoryArray = Object.entries(res.data.categories).map(([key, value]) => ({
          id: key,
          name: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
          ...value
        }));
        setCategories(categoryArray);
      } catch (err) {
        console.error("Failed to fetch highlights:", err);
      }
    };

    fetchHighlights();
  }, []);
  
  // Scroll functions for mobile section
  const scrollMobileLeft = () => {
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollMobileRight = () => {
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Scroll functions for laptop section
  const scrollLaptopLeft = () => {
    if (laptopScrollRef.current) {
      laptopScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollLaptopRight = () => {
    if (laptopScrollRef.current) {
      laptopScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  const navigate = useNavigate();

  const handleCategoryClick = (product) => {
    console.log(product.category)
    navigate("/products/category", {
      state: { category: "/category/"+product.category.toLowerCase()},
    });
  };

  // State for hero banner
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bestDeals.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [bestDeals.length]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const handleClick = (product) => {
    navigate("/product-detail", {
      state: { category: "/category/" + product.category, id: product.id },
    });
  };

  return (
    <div className="bg-white text-gray-800">
      <section
        className="relative h-[70vh] overflow-hidden mt-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false}>
          {bestDeals.map((banner, index) =>
            index === currentBanner ? (
              <motion.div
                key={banner.id}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Full-size background image */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-contain object-top md:object-right"
                />

                {/* Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                {/* Content aligned left */}
                <div className="relative z-10 h-full flex md:items-center items-end px-6 md:px-16 max-w-6xl">
                  <div className="text-white max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 leading-tight">
                      {banner.title.slice(0, 50)}
                    </h1>
                    <p className="text-lg md:text-xl font-medium mb-6">
                      {banner.subtitle}
                    </p>
                    <div className="mb-10">
                      <div className="flex items-center gap-6 mb-6">
                        <span className="text-3xl font-bold">
                          {banner.price}
                        </span>
                        <span className="text-xl line-through text-gray-300">
                          ₹
                          {parseInt(
                            banner.price.replace(/,/g, "").replace("₹", "")
                          ) * 1.25}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={()=>{handleClick(banner)}}
                        className="relative overflow-hidden group py-3 px-6 font-bold uppercase tracking-wider border border-black bg-white text-black"
                      >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                          Shop Now
                        </span>
                        <span className="absolute inset-0 bg-black scale-x-0 origin-left transition-transform duration-200 ease-in-out group-hover:scale-x-100 z-0"></span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Scroll Arrows */}
        <button
          onClick={() =>
            setCurrentBanner(
              (prev) => (prev - 1 + bestDeals.length) % bestDeals.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full"
          aria-label="Previous Banner"
        >
          ‹
        </button>

        <button
          onClick={() =>
            setCurrentBanner((prev) => (prev + 1) % bestDeals.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full"
          aria-label="Next Banner"
        >
          ›
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {bestDeals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full border border-white transition-all ${
                index === currentBanner ? "bg-white" : "bg-gray-700"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Mobile Deals Section */}
      <section className="py-16 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold uppercase tracking-tight">
                BEST DEALS ON MOBILES
              </h2>
              <button
                onClick={() => handleCategoryClick(phones?.[0])}
                className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 hover:opacity-75"
              >
                VIEW ALL
              </button>
            </div>

            {/* Horizontal scrolling section */}
            <div className="relative">
              {/* Scroll buttons */}
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0  justify-between z-10 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollMobileLeft}
                  className="pointer-events-auto bg-black text-white p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Scroll left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="square"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollMobileRight}
                  className="pointer-events-auto bg-black text-white p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Scroll right"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="square"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable container */}
              <motion.div
                ref={mobileScrollRef}
                className="flex overflow-x-auto pb-6 no-scrollbar"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {phones.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex-shrink-0 w-72 mx-3"
                    variants={fadeIn}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Product product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Custom scrollbar indicator */}
              <div className="h-1 bg-gray-200 w-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{
                    width: "33%",
                    transform: `translateX(-20%)`, // Would need to be dynamic based on scroll position
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Laptop Deals Section */}
      <section className="py-16 border-b border-gray-300 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold uppercase tracking-tight">
                BEST DEALS ON LAPTOPS
              </h2>
              <button className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 hover:opacity-75">
                VIEW ALL
              </button>
            </div>

            {/* Horizontal scrolling section */}
            <div className="relative">
              {/* Scroll buttons */}
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between z-10 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollLaptopLeft}
                  className="pointer-events-auto bg-black text-white p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Scroll left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="square"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollLaptopRight}
                  className="pointer-events-auto bg-black text-white p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Scroll right"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="square"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable container */}
              <motion.div
                ref={laptopScrollRef}
                className="flex overflow-x-auto pb-6 no-scrollbar"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {laptops.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex-shrink-0 w-72 mx-3"
                    variants={fadeIn}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Product product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Custom scrollbar indicator */}
              <div className="h-1 bg-gray-200 w-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{
                    width: "33%",
                    transform: `translateX(-20%)`, // Would need to be dynamic based on scroll position
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fashion Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-8">
              FASHION CATEGORIES
            </h2>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className="border border-gray-300 overflow-hidden relative group"
                  variants={fadeIn}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="bg-gray-200 aspect-square flex items-center justify-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
                    <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      SHOP NOW
                    </h3>
                  </div>
                  <h3 className="text-xl font-extrabold uppercase tracking-tight p-4 text-center border-t border-gray-300">
                    {category.name}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-4">
              NEVER MISS A DEAL
            </h2>
            <p className="text-lg font-semibold tracking-wide mb-8 opacity-80">
              Subscribe to our newsletter for exclusive offers and new arrivals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="py-3 px-6 text-base font-semibold tracking-wide w-full sm:w-auto bg-transparent border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black py-3 px-10 text-base font-bold uppercase tracking-wider w-full sm:w-auto"
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
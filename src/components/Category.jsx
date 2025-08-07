import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./category.css"; // Ensure this CSS file is linked

function Category() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("/");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Create a ref for the scrollable categories container
  const scrollContainerRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/categories`);
        setCategoriesList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Navigate when clicking a category
  const handleCategoryClick = (categoryPath) => {
    setSelectedCategory(categoryPath);
    navigate("/", { state: { category: categoryPath } });
  };

  // Function to scroll the categories left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200, // Scroll by 200px to the left
        behavior: 'smooth' // Smooth scrolling animation
      });
    }
  };

  // Function to scroll the categories right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200, // Scroll by 200px to the right
        behavior: 'smooth' // Smooth scrolling animation
      });
    }
  };

  return (
    <div className={`relative w-full bg-white py-2 px-8 border-b border-gray-200 categories `}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Header Title */}
        <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">

          <button
            className="ml-auto md:hidden text-gray-900"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isExpanded
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Categories List */}
        <div
          className={`w-full md:w-auto transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-96" : "max-h-0 md:max-h-full"
          }`}
        >
          {/* Wrapper for scroll buttons and scrollable content */}
          <div className=" flex items-center">
            {/* Left Scroll Button (Desktop Only) */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hidden md:block scroll-button"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dynamic Category Buttons - This is the scrollable area */}
            <div ref={scrollContainerRef} className="flex overflow-x-auto whitespace-nowrap gap-4 py-4 md:py-0 no-scrollbar flex-grow px-8 md:px-0 mx-10">
              {/* All Products Button */}
              <button
                className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 relative
                  ${
                    selectedCategory === "/"
                      ? "text-gray-900 bg-gray-50 border border-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                onClick={() => handleCategoryClick("/")}
              >
                All Products
                {selectedCategory === "/" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
                )}
              </button>

              {/* Dynamic Category Buttons */}
              {categoriesList.map((category, index) => {
                const path = `/category/${category}`;
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 relative
                      ${
                        selectedCategory === path
                          ? "text-gray-900 bg-gray-50 border border-gray-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    onClick={() => handleCategoryClick(path)}
                  >
                    {category}
                    {selectedCategory === path && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button (Desktop Only) */}
            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hidden md:block scroll-button"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;

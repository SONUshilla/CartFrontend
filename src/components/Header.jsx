import {React, useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Category from "./Category";

function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const location = useLocation();

  // Define paths where Category should be shown
  const pathsWithCategory = ["/", "/products", "/product-details"];

  // Check if current pathname matches
  const shouldShowCategory = pathsWithCategory.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchBar(false);
    }
  };

  return (
    <div className={`z-50 fixed top-0 left-0 transition-transform duration-400 w-full ${
      showHeader ? "translate-y-0" : "-translate-y-full"
    }`}>
      <header className={`w-full bg-white border-b border-gray-200 py-4 px-8`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo with diagonal accent */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="absolute -inset-4 transform rotate-45 bg-gray-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="flex items-center relative z-10">
                <div className="bg-gray-900 w-12 h-12 flex items-center justify-center mr-3 transform -skew-x-12">
                  <div className="text-white font-bold text-xl skew-x-12">E</div>
                </div>
                <h1 className="text-2xl font-bold tracking-tighter text-gray-900">
                  COMMERCE<span className="text-gray-500">.STORE</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, visible on medium+ */}
          <form 
            onSubmit={handleSearch}
            className={`hidden md:flex flex-1 max-w-2xl mx-6 ${showSearchBar ? 'md:!flex' : ''}`}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border-2 border-gray-300 bg-white h-10 pl-4 pr-10 text-sm focus:outline-none focus:border-gray-900 transition-colors duration-300"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Navigation and Auth Buttons */}
          <div className={`flex items-center space-x-6 `}>
            <div className="hidden md:flex items-center space-x-1">
              <div className="h-8 w-1 bg-gray-900 mr-2"></div>
              <button 
                className="px-4 py-2 text-sm font-medium tracking-wide uppercase text-gray-600 hover:text-gray-900 transition-colors duration-300 relative group"
                onClick={() => navigate("/")}
              >
                Home
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></div>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mobile search button */}
              <button 
                className="md:hidden p-2 text-gray-500 hover:text-gray-900"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {!token ? (
                <>
                  <button 
                    className="px-4 py-2 text-sm font-medium tracking-wide uppercase bg-gray-900 text-white hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 relative overflow-hidden group"
                    onClick={() => navigate("/signUp")}
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
                </>
              ) : (
                <button 
                  className="px-4 py-2 text-sm font-medium tracking-wide uppercase border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 relative overflow-hidden group"
                  onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
                >
                  <span className="relative z-10">Logout</span>
                  <div className="absolute inset-0 bg-gray-900 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              )}
              
              {/* Shopping Cart with Diagonal Design */}
              <div 
                className="relative cursor-pointer group"
                onClick={() => navigate("/cart")}
              >
                <div className="w-10 h-10 flex items-center justify-center border-2 border-gray-900 transform -skew-x-12 group-hover:bg-gray-900 transition-colors duration-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-gray-900 group-hover:text-white skew-x-12 transition-colors duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full transform group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Appears when toggled */}
        {showSearchBar && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border-2 border-gray-300 bg-white h-10 pl-4 pr-10 text-sm focus:outline-none focus:border-gray-900 transition-colors duration-300"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </header>
      {shouldShowCategory && <Category />}
    </div>
  );
}

export default Header;
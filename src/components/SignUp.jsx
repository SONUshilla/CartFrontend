import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import setUpAxios from "./setUpAxios";

const AuthPage = () => {
  const baseUrl = process.env.REACT_APP_BASEURL || "http://localhost:5000";
  const navigate = useNavigate();
  
  // State for authentication
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      if (isLoginMode) {
        // Login logic
        const response = await axios.post(`${baseUrl}/login`, { username, password });
        
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setUpAxios();
          
          // Synchronize cart items
          const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
          if (cartItems.length > 0) {
            await Promise.all(cartItems.map(item => {
              return axios.post(`${baseUrl}/cart`, { item });
            }));
          }
          
          navigate("/");
        }
      } else {
        // Registration logic
        await axios.post(`${baseUrl}/register`, { username, password });
        setIsLoginMode(true);
        setPassword("");
        setErrorMessage("Registration successful! Please sign in.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(
        error.response?.data?.message || 
        (isLoginMode ? "Invalid credentials" : "Registration failed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Diagonal accent */}
        <div className="relative w-full h-2 bg-gray-900 transform -skew-x-12 -translate-x-2 mb-2"></div>
        
        <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
          {/* Toggle switch */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-5 text-center font-bold tracking-wider uppercase transition-all duration-300 relative ${
                isLoginMode 
                  ? "text-gray-900 bg-white" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setIsLoginMode(true)}
            >
              Sign In
              {isLoginMode && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-900"></div>
              )}
            </button>
            <button
              className={`flex-1 py-5 text-center font-bold tracking-wider uppercase transition-all duration-300 relative ${
                !isLoginMode 
                  ? "text-gray-900 bg-white" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setIsLoginMode(false)}
            >
              Sign Up
              {!isLoginMode && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-900"></div>
              )}
            </button>
          </div>
          
          {/* Form container with slide effect */}
          <div className="relative overflow-hidden">
            <div 
              className={`transition-transform duration-500 ease-in-out ${
                isLoginMode ? "translate-x-0" : "-translate-x-[50%]"
              }`}
              style={{ width: "200%" }}
            >
              <div className="flex w-full">
                {/* Sign In Form */}
                <div className="w-1/2 px-8 py-10">
                  <h2 className="text-2xl font-bold mb-8 text-center">Welcome Back</h2>
                  <form onSubmit={handleSubmit}>
                    {errorMessage && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200">
                        {errorMessage}
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gray-900 text-white font-bold tracking-wider uppercase border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Processing..." : "Sign In"}
                      </span>
                      <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                  </form>
                </div>
                
                {/* Sign Up Form */}
                <div className="w-1/2 px-8 py-10">
                  <h2 className="text-2xl font-bold mb-8 text-center">Create Account</h2>
                  <form onSubmit={handleSubmit}>
                    {errorMessage && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200">
                        {errorMessage}
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gray-900 text-white font-bold tracking-wider uppercase border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Processing..." : "Sign Up"}
                      </span>
                      <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {/* Diagonal footer */}
          <div className="relative w-full h-2 bg-gray-900 transform skew-x-12 -translate-x-8 mt-8"></div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginMode ? (
            <p>
              Don't have an account?{" "}
              <button 
                onClick={() => setIsLoginMode(false)}
                className="text-gray-900 font-medium underline hover:text-gray-700"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => setIsLoginMode(true)}
                className="text-gray-900 font-medium underline hover:text-gray-700"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
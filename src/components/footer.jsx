import React from 'react';
import { motion } from 'framer-motion';
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 relative overflow-hidden">
      {/* Diagonal accent */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gray-900 transform -skew-y-2 origin-left -translate-y-8"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gray-900 w-10 h-10 flex items-center justify-center mr-3 transform -skew-x-12">
                <div className="text-white font-bold text-xl skew-x-12">E</div>
              </div>
              <h2 className="text-2xl font-bold tracking-tighter text-gray-900">
                COMMERCE<span className="text-gray-500">.STORE</span>
              </h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Experience premium shopping with curated collections and exceptional service. Fast shipping and hassle-free returns.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://twitter.com/commerce_store"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 group"
              >
                <FaTwitter className="text-gray-500 group-hover:text-white" />
              </motion.a>
              <motion.a
                href="https://facebook.com/commerce.store"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 group"
              >
                <FaFacebookF className="text-gray-500 group-hover:text-white" />
              </motion.a>
              <motion.a
                href="https://instagram.com/commerce.store"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 group"
              >
                <FaInstagram className="text-gray-500 group-hover:text-white" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/company/commerce-store"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 group"
              >
                <FaLinkedinIn className="text-gray-500 group-hover:text-white" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Quick Links</h3>
            <div className="h-0.5 w-12 bg-gray-900 mb-6"></div>
            <ul className="space-y-3">
              {[ 'Products', 'About Us', 'Contact'].map(item => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-300 flex items-center">
                    <div className="w-2 h-2 bg-gray-900 mr-3"></div>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Customer Service</h3>
            <div className="h-0.5 w-12 bg-gray-900 mb-6"></div>
            <ul className="space-y-3">
              {['FAQs', 'Shipping', 'Returns', 'Privacy Policy'].map(item => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <a href={`/#`} className="text-gray-600 hover:text-gray-900 transition-colors duration-300 flex items-center">
                    <div className="w-2 h-2 bg-gray-900 mr-3"></div>
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Contact Us</h3>
            <div className="h-0.5 w-12 bg-gray-900 mb-6"></div>
            <address className="not-italic text-gray-600 space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>123 Commerce Blvd, Suite 100, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+1 (415) 555-1234</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>support@commerce.store</span>
              </div>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-12"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Commerce.Store. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="/#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

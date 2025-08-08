import {React, useState } from 'react'
import { motion } from "framer-motion";

import { toast } from "react-toastify";
import {AddToCart} from "../service/cartService";
import { useNavigate } from "react-router-dom";
function Product({product}) {
    const [hoveredItem, setHoveredItem] = useState(null);
    const navigate = useNavigate();
    const handleClick = (product) => {
        navigate("/product-detail", {
          state: { category: "/category/" + product.category, id: product.id },
        });
      };
    
      const addItem = (items) => {
        if (AddToCart(items)) {
          toast.success("🛒 Item added to cart!");
        }
      };
  return (
    <motion.div
    key={product.id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div
      className={`relative group bg-white border border-gray-200 transition-all duration-300 overflow-hidden
      ${hoveredItem === product.id ? "shadow-xl" : "shadow-md"}`}
      onMouseEnter={() => setHoveredItem(product.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-900 transform rotate-45 translate-x-12 -translate-y-12"></div>

      <div className="p-6 pb-0 h-64 flex items-center justify-center relative">
        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold tracking-wide">
          NEW ARRIVAL
        </div>
        <img
          onClick={() => handleClick(product)}
          className={`max-h-48 object-contain transition-transform duration-300 ${
            hoveredItem === product.id ? "scale-110" : "scale-100"
          }`}
          src={product.image}
          alt={product.title}
        />
      </div>

      <div className="p-6 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-xs text-gray-500">STARTING AT</p>
            <p className="text-xl font-bold">${product.price}</p>
          </div>
          <button
            onClick={() => addItem(product)}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-bold tracking-wider uppercase 
              hover:text-gray-900 hover:bg-white border-2 border-gray-900 transition-all duration-300
              relative overflow-hidden"
          >
            <span className="relative z-10">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  </motion.div>
  )
}

export default Product;

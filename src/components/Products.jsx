import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify'

import fetchProducts from "../service/productService";
import { motion } from "framer-motion";
import AddToCart from "../service/cartService";
import ProductGrid from "./reusable/productGrid";
const Products = ({ category }) => {

  const [path, setPath] = useState("/");
  const [products, setProducts] = useState([]);

  const [myClass, setMyClass] = useState("");

  useEffect(() => {
    setPath(category || "/");
    setMyClass("animate-fadeIn");
  }, [category]);




  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts(path); // category is your path here
      console.log(products);
      setProducts(products);
    };
  
    loadProducts();
  }, [category, path]);
  



  return (
    <div className={`${myClass} min-h-screen bg-white py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              OUR PRODUCTS
            </h1>
            <div className="h-1 w-24 bg-gray-900 mt-2"></div>
          </div>
          <div className="text-sm text-gray-500">
            {products.length} ITEMS • CURATED COLLECTION
          </div>
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default Products;
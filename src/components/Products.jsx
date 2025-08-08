import React, { useEffect, useState } from "react";
import fetchProducts from "../service/productService";
import Product from "../utils/product";
import LandingPage from "../Pages/landingPage";

const Products = ({ category }) => {
  const [path, setPath] = useState("/none");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Optional: Loading state
  const [error, setError] = useState(null); // Optional: Error state

  useEffect(() => {
    if (category) {
      setPath(category);
    }
  }, [category]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!path || path === "/none") return;

      setLoading(true);
      setError(null);

      try {
        const products = await fetchProducts(path);
        if (products) {
          setProducts(products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [path]);

  // Prevent rendering when products are not available
  if (!category) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Please select a category.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {products.length > 0
                ? products[0].category?.toUpperCase()
                : category.toUpperCase()}
            </h1>
            <div className="h-1 w-24 bg-gray-900 mt-2"></div>
          </div>
          <div className="text-sm text-gray-500">
            {products.length} ITEMS • CURATED COLLECTION
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <Product key={idx} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

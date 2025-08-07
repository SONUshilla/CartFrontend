// ProductDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import fetchProducts from '../service/productService';
import ScrollToTop from '../utils/scrollToTop';
import { motion } from 'framer-motion';
import ProductGrid from './reusable/productGrid';
import {AddToCart} from '../service/cartService';
import { toast } from 'react-toastify';
const ProductDetail = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProduct, setAllProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const location=useLocation();
  const [id,setId]=useState()
  const [category,setCategory]=useState();
  useEffect(() => {
    if (location.state) {
      setId(location.state.id);
      setCategory(location.state.category);
    }
  }, [location.state]); // runs only when location.state changes


  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts(category); // category is your path here
      const foundProduct = products.find((p) => p.id === parseInt(id));
      setAllProduct(products);
      if (foundProduct) {
        // Transform backend data to frontend structure
        const transformedProduct = {
          ...foundProduct,
          // Convert price string to number
          price: parseFloat(foundProduct.price),
          // Create image array from single image
          images: [foundProduct.image],
          colors: [foundProduct.color],
          rating_rate:parseFloat(foundProduct.rating_rate)
        };

        setProduct(transformedProduct);
        setSelectedColor(transformedProduct.colors[0]);
      }

      setLoading(false);
    };

    if (category) { // only run when category is ready
      loadProducts();
    }
  }, [category, id]);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
  
    }, 800);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const Add = (product) => {
    if(AddToCart(product))
    {
      toast.success("🛒 Item added to cart!");
    }
  };

  const BuyNow = () => {
    navigate('/checkout', {
      state: {
        products:[product]
      }
    });
    console.log(product)
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div>
              <div className="bg-gray-200 rounded-xl w-full h-96 mb-4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
                ))}
              </div>
            </div>
            
            {/* Product Details Skeleton */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="flex space-x-4 mb-6">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="flex space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200"></div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="flex items-center w-48">
                  <div className="w-10 h-10 bg-gray-200 rounded-l-md"></div>
                  <div className="w-16 h-10 border-t border-b border-gray-200"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-r-md"></div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <div className="h-12 bg-gray-200 rounded-md flex-1"></div>
                <div className="h-12 bg-gray-200 rounded-md flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Product Not Found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Calculate discounted price if on sale
  const originalPrice = product.price;
  const discountPercentage = product.discount || 0;
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);

  return (
    <div className="min-h-screen bg-white py-12">
      <ScrollToTop/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <a  onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-500">
                  <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a  onClick={() => navigate('/products')} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Products</a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500 line-clamp-1" aria-current="page">{product.title.slice(0,30) + " ..."}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-200">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className="w-full h-96 object-contain p-4"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'border-indigo-600 shadow-md scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>
              
              {product.onsale && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center mt-4 gap-4">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating_rate || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating_rate?.toFixed(1) || 'N/A'} ({product.rating_count || 0} reviews)
                </span>
              </div>
              
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {product.brand}
              </span>
              
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Low Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            
            <div className="mt-6">
              <div className="flex items-baseline gap-4">
                {product.onsale && (
                  <span className="text-2xl text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                )}
                <span className="text-3xl font-bold text-gray-900">${discountedPrice.toFixed(2)}</span>
                
                {product.onsale && (
                  <span className="text-lg font-bold text-red-600">Save {discountPercentage}%</span>
                )}
              </div>
              
              {product.onsale && (
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                          Limited Time Offer
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-red-600">
                          12:34:56
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                      <div 
                        style={{ width: "75%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Color: <span className="font-normal capitalize">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === color 
                        ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ 
                      backgroundColor: color === 'black' ? '#000' : 
                                     color === 'white' ? '#fff' : 
                                     color === 'blue' ? '#3b82f6' : 
                                     color === 'red' ? '#ef4444' : 
                                     color === 'brown' ? '#a52a2a' : 
                                     color === 'silver' ? '#c0c0c0' : 
                                     color === 'space gray' ? '#4b5563' : 
                                     color === 'gold' ? '#fde047' : '#e5e7eb'
                    }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    {selectedColor === color && (
                      <svg className="w-5 h-5 text-white mix-blend-difference" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center mt-2 gap-4">
                <div className="flex">
                  <button 
                    onClick={decrementQuantity}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md ${
                      quantity <= 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md ${
                      quantity >= product.stock 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500">{product.stock} available</span>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {Add(product)}}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Add to Cart
              </button>
              <button
                onClick={BuyNow}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 font-medium transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Buy Now
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Free Shipping & Returns</p>
                  <p className="text-gray-600 mt-1">Free standard shipping and free 30-day returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && ` (${product.rating_count || 0})`}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 ">Product Description</h3>
                <div className="prose prose-indigo max-w-none">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-start">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Why you'll love it</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">Premium build quality with durable materials</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">Optimized for performance and efficiency</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">Backed by {product.brand}'s 2-year warranty</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <div className="text-5xl font-bold text-indigo-600 mb-2">
                        {product.rating_rate?.toFixed(1) || '4.5'}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(product.rating_rate || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {product.rating_count || 24} reviews</p>
                    </div>
                    
                    <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="space-y-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i}
                                  className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 font-medium text-gray-900">Alex Johnson</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-gray-500 text-sm">2 weeks ago</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">Great performance for the price</h4>
                          <p className="text-gray-600">
                            This laptop has exceeded my expectations. The display is crisp, performance is smooth even 
                            with multiple apps open, and battery life lasts through my workday. Highly recommend!
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <ProductGrid products={allProduct.filter(p => p.id !== product.id)}/>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
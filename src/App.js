import React from "react";
import { BrowserRouter as Router,Route,Routes, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import Cart from "./components/cart";
import ContactSection from "./Pages/contactPage.jsx";
import Footer from "./components/footer.jsx";
import AboutPage from "./Pages/aboutPage.jsx";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProductDetail from "./components/productDetail.jsx";
import OrdersPage from "./Pages/ordersPage.jsx";
import ScrollToTop from "./utils/scrollToTop.jsx";
import CheckoutPage from "./Pages/orderConfirmationPage.jsx";
import OrderDetailsPage from "./Pages/orderDetails.jsx";
import LandingPage from "./Pages/landingPage.jsx";

function App() {
  const location=useLocation();
    // Define paths where Category should be shown
    const pathsWithCategory = ["/", "/products", "/product-detail","/products/category"];

    // Check if current pathname matches
    const shouldShowCategory = pathsWithCategory.includes(location.pathname);
  return (
    <>
    
        <ScrollToTop />
        <Header />
        <main className={`min-h-screen  ${shouldShowCategory ? 'mt-32' : 'mt-12'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products/category" element={<HomePage />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/checkOut" element={<CheckoutPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
          </Routes>
        </main>
        <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;

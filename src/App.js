import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
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

function App() {
  return (<>
<Router>
 <ScrollToTop />
 <Header />
  <main className="min-h-screen mt-28">
 
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<ContactSection />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/product-detail" element={<ProductDetail />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/checkOut" element={<CheckoutPage/>}/>
      <Route path="/orders/:id" element={<OrderDetailsPage />} />

    </Routes>
  </main>
  <Footer />
</Router>
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

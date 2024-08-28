import React from "react";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Header from "./components/Header";
import Cart from "./components/cart";

function App() {
  return (<>
    <Router>
    <div className="Card1">
    <Header/>
</div>
    <Routes >
    <Route path="/" element={<HomePage/>}></Route>
      <Route path="/signUp" element={<SignUp/>}></Route>
      <Route path="/signIn" element={<SignIn/>}></Route>
      <Route path="/cart" element={<Cart />} />
    </Routes>
    </Router>

    </>
  );
}

export default App;

import React, { useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import setUpAxios from "./setUpAxios";
const SignIn = () => {
  const baseUrl=process.env.BASEURL;
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/login`, { username, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUpAxios();
        // After successful login, synchronize cart items
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        if (cartItems.length > 0) {
          await Promise.all(cartItems.map(item => {
            return axios.post(`${baseUrl}/cart`,{item});
          }));

        }

        console.log("Sign In:", { username, password });
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;

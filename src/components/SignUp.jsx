import React, { useState } from "react";
import "./SignUp.css"; // Create this CSS file for styling
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const baseUrl=process.env.BASEURL || "http://localhost:5000";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();


    const response=axios.post(`${baseUrl}/register`,{username,password});
    console.log(response);
    console.log("Sign Up:", { username, password });
    navigate("/signin");
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/signin">Sign In</a>
      </p>
    </div>
  );
};

export default SignUp;

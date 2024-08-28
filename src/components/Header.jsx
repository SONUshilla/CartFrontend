import React from "react";
import { useNavigate } from "react-router-dom";

function Header(){
    const token=localStorage.getItem("token");
    const navigate=useNavigate();
    return   (      
    <header className="header">
    <div onClick={()=>{navigate("/")}} className="logo"><img src="../images/Gemini_Generated_Image_p5agoyp5agoyp5ag (1).jpg" alt=""></img>Ecommerse</div>
    <div className="auth-buttons">
        {!token && <><button onClick={()=>{navigate("/signIn")}} className="sign-in">Sign In</button>
        <button onClick={()=>{navigate("/signUp")}} className="sign-up">Sign Up</button></>}
        {token && <button onClick={()=>{localStorage.removeItem("token"); navigate("/")}}>Logout</button>}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <div className="ShoppingCart">
        <span onClick={()=>{navigate("/cart")}} class="material-symbols-outlined">
        shopping_cart</span>
        </div>
    </div>
   
    </header>);
}
export default Header;
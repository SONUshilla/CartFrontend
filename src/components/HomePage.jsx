import React from "react";
import Category from "./Category";
import Products from "./Products";
import "./Homepage.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
function HomePage() {
    const location = useLocation(); // Access location state
    const category = location.state?.category; // Retrieve passed state (category)


return  <div className="Main">

<div className="Card1">

</div>
<div className="Card2">
        <Category/>
</div>
<div className="Card3">
      <Products category={category} />
</div>
</div>
   
}

export default HomePage;
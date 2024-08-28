import React, { useState, useEffect } from "react";
import axios from "axios";
import "./category.css";
import { useNavigate } from "react-router-dom";

function Category() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/categories`, {
          withCredentials: false // Ensure no credentials are included in the request
        });
        setCategoriesList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Navigate to the ProductPage with the selected category as state
      navigate("/", { state: { category: selectedCategory } });
    }
  }, [selectedCategory, navigate]); // Add `navigate` to the dependency array

  return (
    <div className="Categories">
    <h4>Category </h4>
    <span  onClick={() => setSelectedCategory("/")}>All Products</span>
      {categoriesList.map((category, index) => (
        <span
          key={index}
          onClick={() => setSelectedCategory(`/category/${category}`)}

        >
          {category}
        </span>
      ))}
    </div>
  );
}

export default Category;

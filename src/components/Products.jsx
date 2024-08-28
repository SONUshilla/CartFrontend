import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css"; // Import your CSS file


const Products = ({category}) => {
  const baseUrl=process.env.BASEURL;
  let storedItems=JSON.parse(localStorage.getItem("cartItems")) || [];
  const [path,setPath]=useState("/");
  const [products, setProducts] = useState([]);
useEffect(()=>{
  if(category){
  setPath(category);
  }
  else{
    setPath("/");
  }
},[category]);

function AddToCart(items) {
  const token = localStorage.getItem("token");
  const newItem = {
      name: items.title,
      quantity: 1,
      image: items.image,
      price: items.price
  };

  if (!token) {
      // User is not logged in, store in localStorage
      const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const itemExists = storedItems.some(item => item.name === newItem.name);

      if (!itemExists) {
          storedItems.push(newItem);
          localStorage.setItem('cartItems', JSON.stringify(storedItems));
          console.log('Item added to local storage cart');
      } else {
          console.log('Item already in cart');
      }
  } else {
      // User is logged in, send the item to the server
      axios.post(`${baseUrl}/cart`, { item: newItem })
          .then(response => {
              if (response.status === 200) {
                  console.log('Item added to server cart');
              }
          })
          .catch(error => {
              console.error('Error adding item to server cart', error);
          });
  }
}

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Using the category in the API endpoint with credentials set to false
        const response = await axios.get(`https://fakestoreapi.com/products${path}`, {
          withCredentials: false // Ensure no credentials are included in the request
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };


      fetchProducts();
  }, [path]); // Fetch products whenever the category changes

  return (
    <div className="productsList">
      <div className="products">
        <div className="product-list">
          {products.map((product) => (
            <div onClick={()=>{AddToCart(product)}} className="product-item" key={product.id}>
              <img
                className="productImage"
                src={product.image}
                alt="hello"
              />
              <div className="product-title">{product.title}</div>
              <div className="productBottom">
              <div className="product-price"><p>Special Price</p>${product.price.toFixed(2)}</div>
              <button className="AddToCart">Add To Cart</button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

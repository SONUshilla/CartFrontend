import axios from "axios";
import setUpAxios from "../components/setUpAxios";
import { color } from "framer-motion";
import { address } from "framer-motion/client";
const baseUrl = process.env.REACT_APP_BASEURL;

export function AddToCart(items) {

    const token = localStorage.getItem("token");
    const newItem = {
      id:items.id,
      name: items.title,
      quantity: 1,
      image: items.image,
      price: items.price,
      color: items.color,
      title:items.title,
    };


      const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const itemExists = storedItems.some(item => item.name === newItem.name);

      if (!itemExists) {
        storedItems.push(newItem);
        localStorage.setItem('cartItems', JSON.stringify(storedItems));
        console.log('Item added to local storage cart');
      } else {
        console.log('Item already in cart');
      }
      if (token) {
      axios.post(
        `${baseUrl}/cart`,
        { item: newItem },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then(response => {
        if (response.status === 200) {
          console.log('Item added to server cart');
        }
      })
      .catch(error => {
        console.error('Error adding item to server cart', error);
      });
    }
    return true;
  }


  export const handleCheckout = async (cartItems,address,navigate,paymentMethod) => {
    try {
        setUpAxios();
        
        const response = await axios.post(`${baseUrl}/checkOut`, {
          cartItems:cartItems,
          address:address,
          paymentMethod:paymentMethod
        },
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
        if (response.status === 200) {
            localStorage.removeItem("cartItems");
            return true;
        }
    } catch (error) {
        navigate("/signIn");
    }
};


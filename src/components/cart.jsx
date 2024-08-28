import React, { useState, useEffect } from 'react';
import './Cart.css'; // Import your CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import setUpAxios from "./setUpAxios";

const Cart = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const baseUrl=process.env.BASEURL;
    const [cartItems, setCartItems] = useState(() => {
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    const navigate = useNavigate();

    // Save cart items to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const updateQuantity = (index, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map((item, i) =>
                i === index ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };

    const deleteItem = (index) => {
        const itemToDelete = cartItems[index];
        
        if (isLoggedIn) {
            // Delete item from the server
            setUpAxios();
            axios.post(`${baseUrl}cart/delete`, { name: itemToDelete.name })
                .then(response => {
                    if (response.status === 200) {
                        // Remove item locally
                        setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
                    }
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                });
        } else {
            // Remove item locally
            setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        async function checkSession() {
            try {
                setUpAxios();
                const response = await axios.get(`${baseUrl}/check-session`);
                setIsLoggedIn(response.status === 200);
            } catch (error) {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            }
        }

        checkSession();
    }, []);

    useEffect(() => {
        // Load cart items from the server if logged in
        if (isLoggedIn) {
          setUpAxios();
            axios.get(`${baseUrl}/getCart`)
                .then(response => setCartItems(response.data))
                .catch(error => console.error('Error fetching cart items:', error));
        }
    }, [isLoggedIn]);

    const handleCheckout = async () => {
        try {
          setUpAxios();
            const response = await axios.post(`${baseUrl}/checkOut`);
            if (response.status === 200) {
                localStorage.removeItem("cartItems");
                alert("Order Placed");
            } else {
                navigate("/signIn");
            }
        } catch (error) {
            navigate("/signIn");
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item, index) => (
                        <tr key={index} className="cartProduct">
                            <td>{index + 1}</td>
                            <td><img className="cartImage" src={item.image} alt={`Item ${index}`} /></td>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                />
                            </td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <button onClick={() => deleteItem(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="cart-summary">
                <h3>Total Price: ${getTotalPrice().toFixed(2)}</h3>
            </div>
            <button className='CheckOut' onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;

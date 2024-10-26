// src/App.js
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import LoginPage from './components/LoginPage';

export default function App() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (email) => {
        setIsLoggedIn(true);
    };

    const handleCheckout = () => {
        // Proceed with checkout logic here
        console.log("Order Placed!");
    };

    return (
        <div>
            {!isLoggedIn ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <>
                    <ProductList />
                    <Cart cartItems={cartItems} handleCheckout={handleCheckout} />
                    <Checkout handleOrderPlacement={handleCheckout} />
                </>
            )}
        </div>
    );
}

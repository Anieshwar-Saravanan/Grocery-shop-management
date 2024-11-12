// components/CartPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [goToCheckout, setGoToCheckout] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cart_display');
                setCart(response.data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                setError('Failed to load cart data.');
                setLoading(false);
            }
        };
        fetchCartData();
    }, []);

    const sendProductName = async (productName) => {
        try {
            const response = await axios.post('http://localhost:5000/api/delete_cart', {
                product_name: productName
            });
            console.log('Product sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending product name:', error);
            setError('Failed to send product name.');
        }
    };

    if (goToCheckout) {
        return <Navigate to="/checkout" />;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalAmount = cart.reduce((acc, item) => acc + item.total_price, 0);

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cart.map((item, index) => (
                        <div key={index}>
                            <p>{item.product_name} - Quantity: {item.quantity} - Price: ${item.total_price.toFixed(2)}</p>
                            <button onClick={() => sendProductName(item.product_name)}>Remove</button>
                        </div>
                    ))}
                    <h3>Total: ${totalAmount.toFixed(2)}</h3>
                    <button onClick={() => setGoToCheckout(true)}>Checkout</button>
                </div>
            )}
        </div>
    );
}

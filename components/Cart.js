import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [goToCheckout, setGoToCheckout] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const customerId = 1; // Replace with dynamic customer ID
    const shopId = 1; // Replace with dynamic shop ID

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

    const handleCheckout = async () => {
        const cartItems = cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.total_price
        }));

        const totalAmount = cart.reduce((acc, item) => acc + item.total_price, 0);
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

        try {
            const response = await axios.post('http://localhost:5000/api/checkout', {
                customer_id: customerId,
                shop_id: shopId,
                total_amount: totalAmount,
                total_items: totalItems,
                cart_items: cartItems
            },
            {
                withCredentials:true
            }
        );
            console.log('Order placed successfully', response.data);
            alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
            setGoToCheckout(true);
        } catch (error) {
            console.error('Error placing order', error);
            alert('Failed to place order');
        }
    };

    if (goToCheckout) {
        return <Navigate to="/checkout" />;
    }

    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</p>;
    }

    if (error) {
        return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
    }

    const totalAmount = cart.reduce((acc, item) => acc + item.total_price, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Cart</h2>
            {cart.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Your cart is empty</p>
            ) : (
                <div>
                    {cart.map((item, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                marginBottom: '10px', 
                                padding: '10px', 
                                border: '1px solid #ddd', 
                                borderRadius: '5px' 
                            }}
                        >
                            <span>{item.product_name} - Quantity: {item.quantity} - Price: ${item.total_price.toFixed(2)}</span>
                            <button 
                                onClick={() => sendProductName(item.product_name)} 
                                style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: '#ff4d4d', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Total: ${totalAmount.toFixed(2)}</h3>
                    <button 
                        onClick={handleCheckout} 
                        disabled={cart.length === 0} 
                        style={{ 
                            display: 'block', 
                            width: '100%', 
                            padding: '10px', 
                            backgroundColor: cart.length === 0 ? '#ccc' : '#4CAF50', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: cart.length === 0 ? 'not-allowed' : 'pointer', 
                            marginTop: '20px' 
                        }}
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

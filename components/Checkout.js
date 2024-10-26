// components/CheckoutPage.js
import React, { useState } from 'react';

export default function CheckoutPage() {
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the checkout process (send data to backend)
        console.log('Order placed:', { address, payment });
    };

    return (
        <div>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Shipping Address" 
                    required 
                />
                <input 
                    type="text" 
                    value={payment} 
                    onChange={(e) => setPayment(e.target.value)} 
                    placeholder="Payment Information" 
                    required 
                />
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
}

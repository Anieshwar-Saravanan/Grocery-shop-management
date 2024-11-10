// components/CheckoutPage.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function CheckoutPage({ totalAmount }) {
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('');
    const [goToOrderPlaced, setGoToOrderPlaced] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the checkout process (send data to backend)
        alert('Order placed:', { address, payment, totalAmount });
    };
    if(goToOrderPlaced){
        return <Navigate to="/order-confirmation" />
    }

    return (
        <div>
            <h2>Checkout</h2>
            <p>Total Price: ${totalAmount}</p> 
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
                <button onClick={() =>
                    setGoToOrderPlaced(true)
                } type='submit'>Place Order</button>
            </form>
        </div>
    );
}

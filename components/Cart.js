// components/CartPage.js
import React, { useState } from 'react';

export default function CartPage() {
    const [cart, setCart] = useState([
        // Mock data for items in the cart
        { id: 1, name: 'Product A', quantity: 2, price: 10 },
        { id: 2, name: 'Product B', quantity: 1, price: 20 },
    ]);

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cart.map(item => (
                        <div key={item.id}>
                            <p>{item.name} - Quantity: {item.quantity} - Price: ${item.price}</p>
                        </div>
                    ))}
                    <h3>Total: ${totalAmount}</h3>
                    <button>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
}

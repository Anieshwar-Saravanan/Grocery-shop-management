// components/OrderConfirmationPage.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
    return (
        <div>
            <h2>Order Confirmed</h2>
            <p>Thank you for your order. You will receive an email confirmation shortly.</p>
            <Link to="/">Back to homePage</Link>
        </div>
    );
}

// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer'); // New state for role
    const [error, setError] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const [goToAdmin, setGoToAdmin] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (role === 'Admin') {
            setGoToAdmin(true); // Set navigation to admin page
        } else {
            setGoToProducts(true); // Set navigation to products page
        }

        // Clear the form fields
        setEmail('');
        setPassword('');
        setError('');
    };

    if (goToProducts) {
        return <Navigate to="/products" />;
    }

    if (goToAdmin) {
        return <Navigate to="/admin" />;
    }

    return (
        <div>
            <h2>Login</h2>
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                </select>
                <br />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
            <h4>If not registered, <Link to="/register">register here</Link>.</h4>
        </div>
    );
}

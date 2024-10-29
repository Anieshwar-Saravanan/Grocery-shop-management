// src/components/LoginPage.js
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        // You would make an API call here to validate the user
        onLogin(email);  // Call the parent handler

        // Clear the form fields
        setEmail('');
        setPassword('');
    };

    return (
        <div>
            <h2>Login</h2>
            <br></br>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br></br>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
            <h4>If not registered <Link to = "/register">register</Link></h4>
        </div>
    );
}

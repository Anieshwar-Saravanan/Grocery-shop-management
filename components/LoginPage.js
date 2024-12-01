import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [error, setError] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const [goToAdmin, setGoToAdmin] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/login',
                {
                    email: email,
                    password: password  // Send both email and password
                },
                {
                    withCredentials:true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data);
            // If login is successful, check the role and navigate
            if (role === 'Admin') {
                setGoToAdmin(true);
            } else {
                
                setGoToProducts(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid credentials. Please try again.');
        }

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
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                />
                <br />
                <label style={{ fontWeight: 'bold' }}>Role:</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                </select>
                <br />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Login
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
            <h4 style={{ marginTop: '20px' }}>
                If not registered,{' '}
                <Link
                    to="/register"
                    style={{
                        color: '#3498db',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    register here
                </Link>
                .
            </h4>
        </div>
    );
}

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function RegistrationPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [phone, setPhone] = useState('1234567890');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [goToLogin, setGoToLogin] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('Name, Email, and Password are required.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        if(role === "customer"){
            try {
                const response = await axios.post('http://localhost:5000/api/customers', {
                    name,
                    email,
                    address,
                    phone,
                    password,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(response.data);
                setGoToLogin(true);
            } catch (error) {
                console.error("Error adding user:", error);
                setError("Error adding user. Please try again.");
            }
        }
        else if(role === "admin"){
            try{const response = await axios.post('http://localhost:5000/api/admins',{
                name,
                email,
                phone,
                password,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
            });
            console.log(response.data);
            setGoToLogin(true);
        } catch (error) {
            console.error("Error adding user:", error);
            setError("Error adding user. Please try again.");
        }
    }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (goToLogin) {
        return <Navigate to="/login" />;
    };


    return (
        <div className="registration-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div className="form-group">
                    <label>Phone number:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                    />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

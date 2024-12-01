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

    // State for Shop Details
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState('');
    const [shopEmail, setShopEmail] = useState('');

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

        if (role === "customer") {
            try {
                const response = await axios.post('http://localhost:5000/api/customers', {
                    name, email, address, phone, password,
                }, { headers: { 'Content-Type': 'application/json' } });

                console.log(response.data);
                setGoToLogin(true);
            } catch (error) {
                console.error("Error adding user:", error);
                setError("Error adding user. Please try again.");
            }
        } else if (role === "admin") {
            if (!shopName || !shopAddress || !shopPhoneNumber || !shopEmail) {
                setError('Shop details are required for admin.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/admins', {
                    name, email, phone, password,
                }, { headers: { 'Content-Type': 'application/json' } });

                const shopResponse = await axios.post('http://localhost:5000/api/shops', {
                    name, shop_name: shopName, shop_address: shopAddress, 
                    shop_phone_number: shopPhoneNumber, shop_email: shopEmail,
                });

                console.log(response.data);
                console.log(shopResponse.data);
                setGoToLogin(true);
            } catch (error) {
                console.error("Error adding admin:", error);
                setError("Error adding admin. Please try again.");
            }
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (goToLogin) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{
            padding: '20px',
            maxWidth: '500px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        style={{
                            width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        style={{
                            width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{
                            width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone number:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        style={{
                            width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        style={{
                            width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                        }}
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {role === 'admin' && (
                    <>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Shop Name:</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="Enter shop name"
                                style={{
                                    width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Shop Address:</label>
                            <input
                                type="text"
                                value={shopAddress}
                                onChange={(e) => setShopAddress(e.target.value)}
                                placeholder="Enter shop address"
                                style={{
                                    width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Shop Phone Number:</label>
                            <input
                                type="tel"
                                value={shopPhoneNumber}
                                onChange={(e) => setShopPhoneNumber(e.target.value)}
                                placeholder="Enter shop phone number"
                                style={{
                                    width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Shop Email:</label>
                            <input
                                type="email"
                                value={shopEmail}
                                onChange={(e) => setShopEmail(e.target.value)}
                                placeholder="Enter shop email"
                                style={{
                                    width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px',
                                }}
                            />
                        </div>
                    </>
                )}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button
                    type="submit"
                    style={{
                        width: '100%', padding: '10px', backgroundColor: '#4CAF50',
                        color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
                    }}
                >
                    Register
                </button>
            </form>
        </div>
    );
}

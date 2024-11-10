// components/AdminDashboard.js
import React, { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const[adminName,setAdminName] = useState('');
    const [error,setError] = useState('')
    const[name,setName] = useState('');
    const[description,setDescription] = useState('');
    const[price,setPrice] = useState('');
    const[stock,setStock] = useState('');
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');




    // Handle input changes


    // Handle product addition
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5000/api/products', {
                adminName,     // Admin name
                name,          // Product name
                description,   // Product description
                price,         // Product price
                stock          // Product stock quantity
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Product details submitted:", response.data);
    
            const productId = response.data.product_id;
            console.log("Newly added Product ID:", productId);
            
            // Fetching Shop details
            const shopResponse = await axios.post('http://localhost:5000/api/shop', {
                shopName,     // Shop name
                shopAddress,  // Shop address
                phoneNumber,  // Shop phone number
                email,         // Shop email
                productId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("Shop details submitted:", shopResponse.data);
    
        } catch (error) {
            console.error("Error submitting details:", error);
            setError("Error submitting details. Please try again.");
        }
    };
    
    
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Manage Products and Orders here.</p>
            
            <form onSubmit={handleSubmit}>
            <div>
                <label>Admin's name:</label>
                <input
                    type="text"
                    name="admin_name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                />
            </div>
                <h3>Add Product</h3>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
                        name="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                

            <h3>Add Shop</h3>
            <div>
                <label>Shop Name:</label>
                <input
                    type="text"
                    name="shop_name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Shop Address:</label>
                <input
                    type="text"
                    name="shop_address"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="tel"
                    name="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div><br></br>
            <button type="submit">Add Product and Shop</button>
            </form>
            <h3>Product List</h3>
            <ul>
                    <li >
                        <h4>{name}</h4>
                        <p>Price: ${price}</p>
                        <p>{description}</p>
                        <p>Stock: ${stock}</p>
                    </li>
            </ul>
        </div>
    );
}


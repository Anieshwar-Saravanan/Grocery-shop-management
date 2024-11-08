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


    // Handle input changes


    // Handle product addition
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5000/api/products',{
                adminName,
                name,
                description,
                price,
                stock
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
        }
        catch (error) {
            console.error("Error adding user:", error);
            setError("Error adding user. Please try again.");
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
                <button type="submit">Add Product</button>
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


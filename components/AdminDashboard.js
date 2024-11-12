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
    const[shopName,setShopName] = useState('');
    const[nameDel,setNameDel] = useState('');


    // Handle input changes


    // Handle product addition
    const addProduct = async () => {
        try{
            const response = await axios.post('http://localhost:5000/api/products',{
                adminName,
                shopName,
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

    const deleteProduct = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/delete_product', {
                product_name: nameDel
            });
            console.log('Product sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending product name:', error);
            setError('Failed to send product name.');
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Manage Products and Orders here.</p>
            
            <form>
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
            <div>
                <label>Shop Name:</label>
                <input
                    type="text"
                    name="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
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
                <button onClick={()=>addProduct()}>Add Product</button>
                <h3>Remove Product</h3>
                <p>Enter the name of the product to be removed</p>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="nameDel"
                        value={nameDel}
                        onChange={(e) => setNameDel(e.target.value)}
                        required
                    />
                </div>
                <button onClick={()=>deleteProduct()}>Remove product</button>
                {error && <p className="error">{error}</p>}
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


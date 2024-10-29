// components/AdminDashboard.js
import React, { useState } from 'react';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value,
        });
    };

    // Handle product addition
    const handleAddProduct = (e) => {
        e.preventDefault();
        setProducts([...products, { ...newProduct, id: Date.now() }]);
        setNewProduct({ name: '', price: '', description: '' });
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Manage Products and Orders here.</p>
            
            <form onSubmit={handleAddProduct}>
                <h3>Add Product</h3>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
            <h3>Product List</h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h4>{product.name}</h4>
                        <p>Price: ${product.price}</p>
                        <p>{product.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}


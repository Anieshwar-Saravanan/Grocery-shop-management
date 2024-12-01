// components/AdminDashboard.js
import React, { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
    const [adminName, setAdminName] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [shopName, setShopName] = useState('');
    const [nameDel, setNameDel] = useState('');

    const addProduct = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/products',
                {
                    adminName,
                    shopName,
                    name,
                    description,
                    price,
                    stock,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error('Error adding user:', error);
            setError('Error adding user. Please try again.');
        }
    };

    const deleteProduct = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/delete_product',
                {
                    product_name: nameDel,
                }
            );
            console.log('Product sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending product name:', error);
            setError('Failed to send product name.');
        }
    };

    return (
        <div
            style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h2 style={{ textAlign: 'center', color: '#333' }}>
                Admin Dashboard
            </h2>
            <p style={{ textAlign: 'center', color: '#555' }}>
                Manage Products and Orders here.
            </p>
            <form>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Admin's name:
                    </label>
                    <input
                        type="text"
                        name="admin_name"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Shop Name:
                    </label>
                    <input
                        type="text"
                        name="shopName"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <h3 style={{ color: '#333' }}>Add Product</h3>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Name:
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Price:
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Description:
                    </label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Stock:
                    </label>
                    <input
                        name="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => addProduct()}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Add Product
                </button>
                <h3 style={{ marginTop: '20px', color: '#333' }}>
                    Remove Product
                </h3>
                <p>Enter the name of the product to be removed</p>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Name:
                    </label>
                    <input
                        type="text"
                        name="nameDel"
                        value={nameDel}
                        onChange={(e) => setNameDel(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => deleteProduct()}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Remove Product
                </button>
                {error && (
                    <p
                        style={{
                            color: 'red',
                            marginTop: '10px',
                        }}
                    >
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}

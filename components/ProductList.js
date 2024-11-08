import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/product_display');
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Error fetching products. Please try again later.");
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {products.map(product => (
                    <li key={product.product_id}>
                        <h3>{product.name}</h3>
                        <p>Description: {product.description}</p>
                        <p>Price: ${product.price.toFixed(2)}</p>
                        <p>Stock Quantity: {product.stock_quantity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

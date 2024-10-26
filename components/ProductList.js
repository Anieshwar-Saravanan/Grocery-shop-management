// components/ProductListingPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductListingPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from backend
        fetch('/products')
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <Link to={`/products/${product.id}`}>
                            {product.name} - ${product.price}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

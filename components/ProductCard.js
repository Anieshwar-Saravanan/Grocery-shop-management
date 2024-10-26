// src/components/ProductCard.js
import React from 'react';

export default function ProductCard({ product }) {
    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            <button>Add to Cart</button>
        </div>
    );
}

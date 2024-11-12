// components/ProductDetailsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [goToCart, setGoToCart] = useState(false);

    useEffect(() => {
        // Fetch the specific product from the backend
        axios.get(`/api/products/${id}`)
            .then(response => {
                setProduct(response.data.product);  // Adjusted to match the response format from backend
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [id]);
    

    const handleAddToCart = () => {
        const cartData = {
            product_id: id,
            quantity: product.quantity, 
            total_items: 1,
            total_price: product.price, 
            subtotal: product.price 
        };
    
        axios.post('/api/cart', cartData)
            .then(response => {
                alert('Product added to cart');
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                alert('Failed to add product to cart');
            });
    };
    

    if (goToCart) {
        return <Navigate to="/cart" />;
    }
    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <div>
                    <label>quantity:</label>
                    <input
                        name="quantity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) => setProduct(e.target.value)}
                        required
                    />
                </div>
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={() => setGoToCart(true)}>Checkout</button>
        </div>
    );
}

// components/ProductDetailsPage.js
import React, { useEffect, useState } from 'react';
import { Navigate,useParams } from 'react-router-dom';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [goToCart, setGoToCart] = useState(false);

    useEffect(() => {
        // Fetch the specific product from the backend
        fetch(`/products/${id}`)
            .then(response => response.json())
            .then(data => setProduct(data));
    }, [id]);

    if(goToCart){
        return <Navigate to="/cart" />
    }
    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <button onClick={() =>
                alert('Added to cart')//api should be added for inserting the product into the database
            }>Add to Cart</button>
            <button onClick={() =>
                setGoToCart(true)
            }>Checkout</button>
        </div>
    );
}

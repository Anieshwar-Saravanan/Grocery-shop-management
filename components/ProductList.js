import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState({});
    const [newReview, setNewReview] = useState({});
    const [quantities, setQuantities] = useState({});
    const [goToCart, setGoToCart] = useState(false);

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

    const handleAddToCart = async (product) => {
        const cartData = {
            total_items: quantities[product.product_id] || 1,
            total_price: product.price * (quantities[product.product_id] || 1),
            quantity: quantities[product.product_id] || 1,
            product_name: product.name,
            subtotal: product.price * (quantities[product.product_id] || 1),
        };

        try {
            const response = await axios.post('http://localhost:5000/api/cart', cartData, {
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log(response.data);
            alert("Product added to cart successfully");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding product to cart. Please try again.");
        }
    };

    const fetchReviews = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/get_reviews/${productId}`);
            setReviews((prevReviews) => ({
                ...prevReviews,
                [productId]: response.data.products,
            }));
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };
    

    const handleReviewChange = (productId, field, value) => {
        setNewReview((prevReview) => ({
            ...prevReview,
            [productId]: {
                ...prevReview[productId],
                [field]: value,
            },
        }));
    };

    const handleSubmitReview = async (productId) => {
        const reviewData = {
            product_id: productId,
            customer_id: 2,
            shop_id: 1,
            rating: newReview[productId]?.rating || 1,
            comment: newReview[productId]?.comment || '',
        };

        try {
            const response = await axios.post('http://localhost:5000/api/add_review', reviewData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data);
            alert("Review submitted successfully");
            fetchReviews(productId);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error submitting review. Please try again.");
        }
    };

    const handleQuantityChange = (product_id, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product_id]: value,
        }));
    };

    if (goToCart) {
        return <Navigate to="/cart" />;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Product List</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <button
                onClick={() => setGoToCart(true)}
                style={{
                    display: 'block',
                    margin: '0 auto 20px',
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Go to Cart
            </button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {products.map(product => (
                    <li
                        key={product.product_id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '15px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <h3>{product.name}</h3>
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                        <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
                        <div>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                max={product.stock_quantity}
                                value={quantities[product.product_id] || 1}
                                onChange={(e) => handleQuantityChange(product.product_id, parseInt(e.target.value, 10))}
                                style={{
                                    width: '50px',
                                    marginLeft: '10px',
                                    padding: '5px',
                                }}
                            />
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Add to Cart
                        </button>
                        <div style={{ marginTop: '20px' }}>
                            <h4>Reviews</h4>
                            <button
                                onClick={() => fetchReviews(product.product_id)}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Show Reviews
                            </button>
                            {reviews[product.product_id] ? (
                                reviews[product.product_id].length > 0 ? (
                                    <ul>
                                        {reviews[product.product_id].map(review => (
                                            <li key={review.review_id}>
                                                <strong>Rating:</strong> {review.rating} <br />
                                                <strong>Comment:</strong> {review.comment} <br />
                                                <strong>Date:</strong> {new Date(review.review_date).toLocaleDateString()}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No reviews for this product.</p>
                                )
                            ) : (
                                <p>Click 'Show Reviews' to see reviews.</p>
                            )}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <h4>Add a Review</h4>
                            <label>
                                Rating:
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newReview[product.product_id]?.rating || ''}
                                    onChange={(e) => handleReviewChange(product.product_id, 'rating', parseInt(e.target.value, 10))}
                                    style={{
                                        marginLeft: '10px',
                                        width: '50px',
                                        padding: '5px',
                                    }}
                                />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Comment:
                                <textarea
                                    value={newReview[product.product_id]?.comment || ''}
                                    onChange={(e) => handleReviewChange(product.product_id, 'comment', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '60px',
                                        padding: '5px',
                                        marginTop: '5px',
                                    }}
                                />
                            </label>
                            <button
                                onClick={() => handleSubmitReview(product.product_id)}
                                style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Submit Review
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

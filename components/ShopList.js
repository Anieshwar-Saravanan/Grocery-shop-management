import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShopList() {
    const [shop, setShop] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/shop_display');
                setShop(response.data.shop);
            } catch (error) {
                console.error("Error fetching shop details:", error);
                setError("Error fetching shop details. Please try again later.");
            }
        };

        fetchShopDetails();
    }, []);

    return (
        <div>
            <h2>Shop Details</h2>
            {error && <p className="error">{error}</p>}
            {shop ? (
                <div>
                    <h3>Shop Name: {shop.shop_name}</h3>
                    <p>Address: {shop.shop_address}</p>
                    <p>Phone Number: {shop.phone_number}</p>
                    <p>Email: {shop.email}</p>
                </div>
            ) : (
                <p>No shop details available.</p>
            )}
        </div>
    );
}
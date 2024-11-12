// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage'
import RegisterPage from './RegistrationPage';
import ProductListingPage from './ProductList';
import ProductDetailsPage from './ProductDetailsPage';
import CartPage from './Cart';
import CheckoutPage from './Checkout';
import OrderConfirmationPage from './OrderConfirmationPage';
import AdminDashboard from './AdminDashboard';
import ShopList from './ShopList';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/Shop" element={<ShopList />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// General Customer Pages
import UserHomePage from '../pages/UserHomePage';
import MenuPage from '../pages/MenuPage';
import CartPage from '../pages/CartPage';
import OrderStatusPage from '../pages/OrderStatusPage';
import LoginPage from '../pages/LoginPage';

// Vendor Pages
import VendorLoginPage from '../pages/vendor/VendorLoginPage';
import VendorRegistrationPage from '../pages/vendor/VendorRegistrationPage';
import VendorDashboardPage from '../pages/vendor/VendorDashboardPage';
import ShopManagementPage from '../pages/vendor/ShopManagementPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminRegistrationPage from '../pages/admin/AdminRegistrationPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

// Protected Route Components
import ProtectedRoute from './ProtectedRoute';
import VendorProtectedRoute from './VendorProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import ReviewsPage from '../pages/ReviewsPage';


const AppRoutes = () => {
    return (
        <Routes>
            {/* ------------------- 📌 PUBLIC / CUSTOMER ROUTES ------------------- */}
            <Route path="/" element={<UserHomePage />} /> {/* NEW: Application Landing Page */}
            <Route path="/menu/:qrIdentifier" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* PROTECTED CUSTOMER ROUTES */}
            <Route
                path="/cart"
                element={
                    <ProtectedRoute>
                        <CartPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrderStatusPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reviews"
                element={
                    <ProtectedRoute>
                        <ReviewsPage />
                    </ProtectedRoute>
                }
            />
            
            {/* ------------------- 📌 VENDOR ROUTES ------------------- */}
            <Route path="/vendor/login" element={<VendorLoginPage />} />
            <Route path="/vendor/register" element={<VendorRegistrationPage />} />
            
            {/* PROTECTED VENDOR ROUTES */}
            <Route
                path="/vendor/dashboard"
                element={
                    <VendorProtectedRoute>
                        <VendorDashboardPage />
                    </VendorProtectedRoute>
                }
            />
            <Route
                path="/vendor/manage-shops"
                element={
                    <VendorProtectedRoute>
                        <ShopManagementPage />
                    </VendorProtectedRoute>
                }
            />

            {/* ------------------- 📌 ADMIN ROUTES ------------------- */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegistrationPage />} />
            
            {/* PROTECTED ADMIN ROUTES */}
            <Route
                path="/admin/dashboard"
                element={
                    <AdminProtectedRoute>
                        <AdminDashboardPage />
                    </AdminProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
    );
};

export default AppRoutes;
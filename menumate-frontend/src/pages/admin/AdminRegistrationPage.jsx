// src/pages/admin/AdminRegistrationPage.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerVendor } from '../../api/vendorService'; // We will reuse the same API call
import { loginAdminUser } from '../../features/admin/adminAuthSlice';

const ADMIN_REGISTRATION_KEY = 'admin123'; // This key should be in your .env file in a real app

const AdminRegistrationPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.adminAuth);

    if (isAuthenticated) {
        navigate('/admin/dashboard', { replace: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (adminKey !== ADMIN_REGISTRATION_KEY) {
            setError('Invalid admin key.');
            setLoading(false);
            return;
        }

        try {
            await registerVendor({ name, email, number, password, role: 'admin' });
            
            const resultAction = await dispatch(loginAdminUser({ email, password }));
            
            if (loginAdminUser.fulfilled.match(resultAction)) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                setError(resultAction.payload);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-secondary mb-6">Admin Registration</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="number" className="block text-gray-700 font-bold mb-2">Phone Number</label>
                    <input type="tel" id="number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="adminKey" className="block text-gray-700 font-bold mb-2">Admin Key</label>
                    <input type="password" id="adminKey" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition duration-300 disabled:opacity-50">
                    {loading ? 'Registering...' : 'Register as Admin'}
                </button>
            </form>
        </div>
    );
};

export default AdminRegistrationPage;
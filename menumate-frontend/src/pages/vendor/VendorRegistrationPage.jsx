// src/pages/vendor/VendorRegistrationPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginVendorUser } from '../../features/vendor/vendorAuthSlice';
import { registerVendor } from '../../api/vendorService';

const VendorRegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.vendorAuth);

  if (isAuthenticated) {
    navigate('/vendor/dashboard', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerVendor({ name, email, number, password });

      const resultAction = await dispatch(loginVendorUser({ email, password }));
      if (loginVendorUser.fulfilled.match(resultAction)) {
        navigate('/vendor/dashboard', { replace: true });
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">MenuMate</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Vendor Registration</h2>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              autoFocus
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="number" className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="number"
              placeholder="e.g. +91 9876543210"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register as Vendor'}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/vendor/login" className="text-accent font-medium hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VendorRegistrationPage;

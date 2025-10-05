// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from || '/cart';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ name, phone }));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-secondary mb-6">Login to Order</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-orange-50 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 bg-orange-50 border border-orange-300  rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-900 text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Continue to Order'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
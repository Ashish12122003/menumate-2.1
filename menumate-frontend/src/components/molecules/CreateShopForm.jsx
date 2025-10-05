// src/components/molecules/CreateShopForm.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShop } from '../../api/vendorService';
import { addShop } from '../../features/vendor/shopSlice';

const CreateShopForm = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newShop = await createShop({ name, address });
            dispatch(addShop(newShop.shop)); // Assuming API returns { shop: { ... } }
            setName('');
            setAddress('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create shop.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Create a New Shop</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Shop Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition duration-300 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Shop'}
            </button>
        </form>
    );
};

export default CreateShopForm;
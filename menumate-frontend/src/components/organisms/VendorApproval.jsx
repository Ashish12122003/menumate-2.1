// src/components/organisms/VendorApproval.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingShops, approveShop, rejectShop } from '../../features/admin/adminSlice';

const VendorApproval = () => {
    const dispatch = useDispatch();
    const { pendingShops, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchPendingShops());
    }, [dispatch]);

    const handleApprove = (shopId) => {
        dispatch(approveShop(shopId));
    };

    const handleReject = (shopId) => {
        dispatch(rejectShop(shopId));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Vendor Shop Approval</h2>
            {pendingShops.length === 0 ? (
                <p>No pending shop applications.</p>
            ) : (
                <ul>
                    {pendingShops.map(shop => (
                        <li key={shop._id} className="p-4 border rounded-md mb-4">
                            <h3 className="text-lg font-semibold">{shop.name}</h3>
                            <p className="text-gray-600">Owner: {shop.owner.name}</p>
                            <p className="text-gray-600">Address: {shop.address}</p>
                            <div className="mt-2">
                                <button onClick={() => handleApprove(shop._id)} className="bg-green-500 text-white py-1 px-4 rounded-md mr-2">Approve</button>
                                <button onClick={() => handleReject(shop._id)} className="bg-red-500 text-white py-1 px-4 rounded-md">Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VendorApproval;
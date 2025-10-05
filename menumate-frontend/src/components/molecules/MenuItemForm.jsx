// src/components/molecules/MenuItemForm.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMenuItem } from "../../api/vendorService";
import { addMenuItem } from "../../features/vendor/shopSlice";

const MenuItemForm = ({ shopId }) => {
    // State variables for form fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true); // New: Default to true
    const [isVegetarian, setIsVegetarian] = useState(false); // New: Default to Non-Veg
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.shops);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null); 
        
        // --- Input Validation Check ---
        if (!image) {
            setError("Image upload is required for this menu item.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", Number(price));
            formData.append("categoryId", category);
            // CRITICAL FIX: Append the new boolean values as strings
            formData.append("isAvailable", isAvailable); 
            formData.append("isVegetarian", isVegetarian); 
            
            if (image) formData.append("image", image);

            const newItem = await createMenuItem(shopId, formData);
            
            // Assuming newItem.data is the correct payload format for Redux
            dispatch(addMenuItem(newItem.data));

            // Set success message and clear form fields after successful submission
            setSuccess(`Item "${name}" added successfully!`); 
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setIsAvailable(true); // Reset state
            setIsVegetarian(false); // Reset state
            setImage(null);
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Server did not respond. Check network or server logs.';
            setError(errorMessage);
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-orange-50 rounded-2xl shadow-inner p-6 md:p-8 mb-8 transition-all duration-200"
        >
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                Create New Menu Item
            </h4>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>} {/* Display success message */}

            {/* Grid: Name & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Item Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-orange-300 bg-white rounded-lg shadow-sm transition"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-orange-300 bg-white rounded-lg shadow-sm transition"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 border border-orange-300 bg-white rounded-lg shadow-sm transition resize-none"
                />
            </div>

            {/* Category */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-orange-300 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-green-900 focus:border-green-900 transition"
                >
                    <option value="">Select a Category</option>
                    {(categories || []).map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* NEW: Status and Dietary Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Availability */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Item Availability</label>
                    <select 
                        value={isAvailable} 
                        onChange={(e) => setIsAvailable(e.target.value === 'true')} 
                        className="w-full px-4 py-2 border border-orange-300 bg-white rounded-lg shadow-sm transition"
                    >
                        <option value="true">Available (Show on Menu)</option>
                        <option value="false">Out of Stock (Hide)</option>
                    </select>
                </div>
                {/* Dietary Type */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Dietary Type</label>
                    <select 
                        value={isVegetarian} 
                        onChange={(e) => setIsVegetarian(e.target.value === 'true')} 
                        className="w-full px-4 py-2 border border-orange-300 bg-white rounded-lg shadow-sm transition"
                    >
                        <option value="true">Vegetarian</option>
                        <option value="false">Non-Vegetarian</option>
                    </select>
                </div>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Item Image</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    className="w-full px-13 py-2 border border-orange-300 bg-white rounded-lg"
                />
                {image && (
                    <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="h-24 mt-2 rounded-lg object-cover"
                    />
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-full text-white font-medium shadow-md transition transform hover:-translate-y-1 hover:scale-105 ${
                    loading ? "bg-blue-300 cursor-not-allowed" : "bg-green-900 hover:bg-green-700"
                }`}
            >
                {loading ? "Adding..." : "Add Menu Item"}
            </button>
        </form>
    );
};

export default MenuItemForm;
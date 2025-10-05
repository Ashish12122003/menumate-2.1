// src/components/molecules/CategoryForm.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../../api/vendorService";
import { addCategory } from "../../features/vendor/shopSlice";

const CategoryForm = ({ shopId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newCategoryResponse = await createCategory(shopId, { name, description });
      dispatch(addCategory(newCategoryResponse.data));
      setName("");
      setDescription("");
    } catch (err) {
      setError("Failed to create category. Please try again.");
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
        Create New Category
      </h4>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg shadow-sm  transition"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg shadow-sm  transition resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-2 rounded-full text-white font-medium shadow-md transition transform hover:-translate-y-1 hover:scale-105 ${
          loading ? "bg-blue-300 cursor-not-allowed" : "bg-green-900 hover:bg-green-900"
        }`}
      >
        {loading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
};

export default CategoryForm;


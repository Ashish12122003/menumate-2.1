// src/components/molecules/CategoryForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../../api/vendorService";
import { addCategory } from "../../features/vendor/shopSlice";

const CategoryForm = ({ shopId }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Category name is required.");
      setLoading(false);
      return;
    }

    try {
      const resp = await createCategory(shopId, { name: name.trim(), description });
      // prefer resp.data but support resp depending on API
      const payload = resp.data ?? resp;
      dispatch(addCategory(payload));
      setSuccess(`Category "${payload.name || name}" created.`);
      resetForm();
      // auto-dismiss success after short delay
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("createCategory error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to create category. Check network or server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8"
      aria-label="Create category form"
    >
      <h4 className="text-2xl font-semibold text-[#B4161B] mb-4">
        Create New Category
      </h4>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-50 border border-red-100 text-red-700 px-4 py-2"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="mb-4 rounded-md bg-green-50 border border-green-100 text-green-700 px-4 py-2"
        >
          {success}
        </div>
      )}

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">
          Category Name
        </label>
        <input
          id="category-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Starters, Desserts"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#B4161B]/30 focus:border-[#B4161B] transition"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label htmlFor="category-desc" className="block text-sm font-medium text-gray-700 mb-2">
          Short Description (optional)
        </label>
        <textarea
          id="category-desc"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional: short note about category"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#B4161B]/30 focus:border-[#B4161B] transition resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-white shadow-sm transition-transform ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#B4161B] hover:bg-[#D92A2A] active:scale-95"
          }`}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>

        <button
          type="button"
          onClick={() => { resetForm(); setError(null); setSuccess(null); }}
          className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

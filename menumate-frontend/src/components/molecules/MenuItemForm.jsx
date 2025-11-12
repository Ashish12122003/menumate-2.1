import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMenuItem } from "../../api/vendorService";
import { addMenuItem } from "../../features/vendor/shopSlice";

const MenuItemForm = ({ shopId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVegetarian, setIsVegetarian] = useState(false);

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

    if (!image) {
      setError("Please upload an image for this menu item.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("categoryId", category);
      formData.append("isAvailable", isAvailable);
      formData.append("isVegetarian", isVegetarian);
      if (image) formData.append("image", image);

      const newItem = await createMenuItem(shopId, formData);
      dispatch(addMenuItem(newItem.data));

      setSuccess(`Item "${name}" added successfully!`);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setIsAvailable(true);
      setIsVegetarian(false);
      setImage(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please check your server or internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 md:p-8 mb-8 transition-all"
    >
      <h4 className="text-2xl font-bold text-[#B4161B] mb-4 border-b border-gray-100 pb-2">
        Add New Menu Item
      </h4>

      {error && (
        <p className="text-red-600 font-medium mb-4 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-700 font-medium mb-4 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
          {success}
        </p>
      )}

      {/* Name & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter item name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B] transition"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B] transition"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="Describe the dish..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B] transition resize-none"
        />
      </div>

      {/* Category */}
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B] transition"
        >
          <option value="">Select a Category</option>
          {(categories || []).map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Availability + Dietary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Availability
          </label>
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value === "true")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B] transition"
          >
            <option value="true">Available (Show on Menu)</option>
            <option value="false">Out of Stock (Hide)</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Dietary Type
          </label>
          <select
            value={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.value === "true")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B] transition"
          >
            <option value="false">Vegetarian 🥦</option>
            <option value="true">Non-Vegetarian 🍗</option>
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">
          Item Image
        </label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#B4161B]/60 focus:border-[#B4161B]"
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="h-28 mt-3 rounded-lg object-cover border border-gray-200 shadow-sm"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full md:w-auto px-8 py-2.5 rounded-full text-white font-semibold shadow-md transition-all ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#B4161B] hover:bg-[#D92A2A] hover:scale-[1.03]"
        }`}
      >
        {loading ? "Adding..." : "Add Menu Item"}
      </button>
    </form>
  );
};

export default MenuItemForm;

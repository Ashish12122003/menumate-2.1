// src/components/organisms/MenuManagement.jsx

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryForm from "../molecules/CategoryForm";
import MenuItemForm from "../molecules/MenuItemForm";
import {
  updateCategory,
  updateMenuItem,
  deleteCategory,
  deleteMenuItem,
} from "../../api/vendorService";
import { fetchShopData } from "../../features/vendor/shopSlice";

const MenuManagement = ({ shopId: propShopId }) => {
  const dispatch = useDispatch();
  const { categories, menuItems, selectedShop } = useSelector(
    (state) => state.shops
  );

  const shopId = propShopId || selectedShop?._id;

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryEditClick = (category) => {
    setEditCategory({ ...category });
    setIsCategoryModalOpen(true);
    setError(null);
  };

  const handleMenuEditClick = (item) => {
    setEditMenuItem({ ...item });
    setIsMenuModalOpen(true);
    setError(null);
  };

  const handleCategorySave = async () => {
    if (!shopId || !editCategory) return;
    setLoading(true);
    setError(null);
    try {
      await updateCategory(shopId, editCategory._id, {
        name: editCategory.name,
      });
      await dispatch(fetchShopData(shopId)).unwrap();
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error("Failed to update category:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update category. Check console/server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSave = async () => {
    if (!shopId || !editMenuItem) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: editMenuItem.name,
        price: Number(editMenuItem.price),
        description: editMenuItem.description,
        isAvailable: editMenuItem.isAvailable,
        isVegetarian: editMenuItem.isVegetarian,
      };

      await updateMenuItem(shopId, editMenuItem._id, payload);
      await dispatch(fetchShopData(shopId)).unwrap();
      setIsMenuModalOpen(false);
    } catch (err) {
      console.error("Failed to update menu item:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update menu item. Check console/server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    if (!shopId) return;
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setLoading(true);
    try {
      await deleteCategory(shopId, categoryId);
      await dispatch(fetchShopData(shopId)).unwrap();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(err.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuDelete = async (itemId) => {
    if (!shopId) return;
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    setLoading(true);
    try {
      await deleteMenuItem(shopId, itemId);
      await dispatch(fetchShopData(shopId)).unwrap();
    } catch (err) {
      console.error("Failed to delete menu item:", err);
      alert(err.response?.data?.message || "Failed to delete menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-900">🍽️ Menu Management</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-all"
            >
              {showCategoryForm ? "Hide Category Form" : "➕ Add Category"}
            </button>
            <button
              onClick={() => setShowMenuItemForm(!showMenuItemForm)}
              className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-all"
            >
              {showMenuItemForm ? "Hide Menu Form" : "➕ Add Menu Item"}
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {showCategoryForm && (
            <div className="bg-gray-100 p-4 rounded-xl border">
              <CategoryForm shopId={shopId} />
            </div>
          )}
          {showMenuItemForm && (
            <div className="bg-gray-100 p-4 rounded-xl border">
              <MenuItemForm shopId={shopId} />
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="text-red-600 mt-6">{error}</div>}

        {/* Categories */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🗂️ Categories
          </h3>
          {categories?.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                >
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCategoryEditClick(cat)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCategoryDelete(cat._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No categories added yet.</p>
          )}
        </div>

        {/* Menu Items */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🍛 Menu Items
          </h3>
          {menuItems?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={item.image?.url || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description || "No description."}
                    </p>
                    <p className="text-green-800 font-medium">₹{item.price}</p>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => handleMenuEditClick(item)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMenuDelete(item._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No menu items found.</p>
          )}
        </div>
      </div>

      {/* Category Edit Modal */}
      {isCategoryModalOpen && editCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Edit Category</h3>
            <input
              value={editCategory.name}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
              placeholder="Category name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCategorySave}
                disabled={loading}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Edit Modal */}
      {isMenuModalOpen && editMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Edit Menu Item</h3>
            <input
              value={editMenuItem.name || ""}
              onChange={(e) =>
                setEditMenuItem({ ...editMenuItem, name: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
              placeholder="Name"
            />
            <input
              type="number"
              value={editMenuItem.price || ""}
              onChange={(e) =>
                setEditMenuItem({ ...editMenuItem, price: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
              placeholder="Price"
            />
            <textarea
              value={editMenuItem.description || ""}
              onChange={(e) =>
                setEditMenuItem({
                  ...editMenuItem,
                  description: e.target.value,
                })
              }
              className="w-full border p-2 rounded mb-3"
              rows={3}
              placeholder="Description"
            />
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-sm mb-1">Available</label>
                <select
                  value={String(editMenuItem.isAvailable ?? true)}
                  onChange={(e) =>
                    setEditMenuItem({
                      ...editMenuItem,
                      isAvailable: e.target.value === "true",
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1">Vegetarian</label>
                <select
                  value={String(editMenuItem.isVegetarian ?? false)}
                  onChange={(e) =>
                    setEditMenuItem({
                      ...editMenuItem,
                      isVegetarian: e.target.value === "true",
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option value="true">Veg</option>
                  <option value="false">Non-Veg</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleMenuSave}
                disabled={loading}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

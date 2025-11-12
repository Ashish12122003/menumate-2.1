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
import { motion, AnimatePresence } from "framer-motion";

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

  // --------------- Handlers ------------------
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
    try {
      await updateCategory(shopId, editCategory._id, {
        name: editCategory.name,
      });
      await dispatch(fetchShopData(shopId)).unwrap();
      setIsCategoryModalOpen(false);
    } catch {
      setError("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSave = async () => {
    if (!shopId || !editMenuItem) return;
    setLoading(true);
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
    } catch {
      setError("Failed to update menu item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Delete this ${type}? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      if (type === "category") await deleteCategory(shopId, id);
      if (type === "menu item") await deleteMenuItem(shopId, id);
      await dispatch(fetchShopData(shopId)).unwrap();
    } catch {
      alert(`Failed to delete ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  // --------------- UI ------------------
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 px-5 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-[#B4161B]/15 shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-200 pb-5">
          <div>
            <h2 className="text-3xl font-extrabold text-[#B4161B] tracking-tight">
              Menu Management
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your categories and dishes in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="px-6 py-2.5 bg-[#B4161B] text-white rounded-full shadow-md hover:bg-[#D92A2A] transition-all font-semibold"
            >
              {showCategoryForm ? "Hide Category Form" : "➕ Add Category"}
            </button>
            <button
              onClick={() => setShowMenuItemForm(!showMenuItemForm)}
              className="px-6 py-2.5 bg-[#B4161B] text-white rounded-full shadow-md hover:bg-[#D92A2A] transition-all font-semibold"
            >
              {showMenuItemForm ? "Hide Menu Form" : "➕ Add Menu Item"}
            </button>
          </div>
        </div>

        {/* Forms Section */}
        <AnimatePresence>
          {showCategoryForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-2xl border border-[#B4161B]/20 shadow-sm mb-6"
            >
              <CategoryForm shopId={shopId} />
            </motion.div>
          )}

          {showMenuItemForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-2xl border border-[#B4161B]/20 shadow-sm mb-6"
            >
              <MenuItemForm shopId={shopId} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="text-red-600 mt-6 text-sm bg-red-50 px-4 py-2 rounded-md border border-red-100">
            {error}
          </div>
        )}

        {/* Categories */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-[#B4161B] mb-6 flex items-center gap-2">
           Categories
          </h3>
          {categories?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((cat) => (
                <motion.div
                  key={cat._id}
                  whileHover={{ scale: 1.03 }}
                  className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {cat.name}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCategoryEditClick(cat)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("category", cat._id)}
                        className="px-3 py-1 text-sm bg-[#B4161B] text-white rounded-md hover:bg-[#D92A2A]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {cat.description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No categories added yet.</p>
          )}
        </section>

        {/* Menu Items */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-[#B4161B] mb-6 flex items-center gap-2">
           Menu Items
          </h3>
          {menuItems?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={item.image?.url || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description || "No description."}
                    </p>
                    <p className="text-[#B4161B] font-bold text-base">
                      ₹{item.price}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.isAvailable
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Out of Stock"}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.isVegetarian
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.isVegetarian ? "Veg 🥦" : "Non-Veg 🍗"}
                      </span>
                    </div>

                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleMenuEditClick(item)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete("menu item", item._id)}
                        className="px-3 py-1 text-xs bg-[#B4161B] text-white rounded-md hover:bg-[#D92A2A]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No menu items found.</p>
          )}
        </section>
      </div>

      {/* Edit Modals */}
      <AnimatePresence>
        {(isCategoryModalOpen || isMenuModalOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-[420px] shadow-2xl border border-[#B4161B]/20"
            >
              {isCategoryModalOpen && editCategory && (
                <>
                  <h3 className="text-xl font-bold text-[#B4161B] mb-4">
                    Edit Category
                  </h3>
                  <input
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded mb-5 focus:ring-2 focus:ring-[#B4161B]/50 focus:outline-none"
                    placeholder="Category name"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCategorySave}
                      disabled={loading}
                      className="px-5 py-2 rounded-full bg-[#B4161B] text-white font-semibold hover:bg-[#D92A2A]"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}

              {isMenuModalOpen && editMenuItem && (
                <>
                  <h3 className="text-xl font-bold text-[#B4161B] mb-4">
                    Edit Menu Item
                  </h3>
                  <input
                    value={editMenuItem.name}
                    onChange={(e) =>
                      setEditMenuItem({
                        ...editMenuItem,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded mb-3 focus:ring-2 focus:ring-[#B4161B]/50 focus:outline-none"
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={editMenuItem.price}
                    onChange={(e) =>
                      setEditMenuItem({
                        ...editMenuItem,
                        price: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 rounded mb-3 focus:ring-2 focus:ring-[#B4161B]/50 focus:outline-none"
                    placeholder="Price"
                  />
                  <textarea
                    value={editMenuItem.description}
                    onChange={(e) =>
                      setEditMenuItem({
                        ...editMenuItem,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full border border-gray-300 p-2 rounded mb-4 focus:ring-2 focus:ring-[#B4161B]/50 focus:outline-none"
                    placeholder="Description"
                  ></textarea>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <label className="text-sm text-gray-700 font-medium">
                        Availability
                      </label>
                      <select
                        value={String(editMenuItem.isAvailable ?? true)}
                        onChange={(e) =>
                          setEditMenuItem({
                            ...editMenuItem,
                            isAvailable: e.target.value === "true",
                          })
                        }
                        className="w-full border border-gray-300 p-2 rounded mt-1"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 font-medium">
                        Type
                      </label>
                      <select
                        value={String(editMenuItem.isVegetarian ?? false)}
                        onChange={(e) =>
                          setEditMenuItem({
                            ...editMenuItem,
                            isVegetarian: e.target.value === "true",
                          })
                        }
                        className="w-full border border-gray-300 p-2 rounded mt-1"
                      >
                        <option value="true">Veg</option>
                        <option value="false">Non-Veg</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsMenuModalOpen(false)}
                      className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMenuSave}
                      disabled={loading}
                      className="px-5 py-2 rounded-full bg-[#B4161B] text-white font-semibold hover:bg-[#D92A2A]"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              )}
              {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuManagement;

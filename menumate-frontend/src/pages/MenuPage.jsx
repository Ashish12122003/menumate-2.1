// src/pages/MenuPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuSlice";
import MenuItemCard from "../components/molecules/MenuItemCard";
import FloatingCartButton from "../components/atoms/FloatingCartButton";
import TopBar from "../components/organisms/TopBar";
import BottomNavBar from "../components/organisms/BottomNavBar";

const MenuPage = () => {
  const { qrIdentifier } = useParams();
  const dispatch = useDispatch();
  const {
    shops,
    categories,
    menuItems,
    loading,
    error,
    isFoodCourt,
    searchQuery,
    table,
  } = useSelector((state) => state.menu);

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const categoryRefs = useRef({});

  const scrollToCategory = (id) => {
    const element = categoryRefs.current[id];
    if (element) {
      const offset = 130;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveCategoryId(id);
    }
  };

  const filterMenuItems = (items, query) => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredItems = filterMenuItems(menuItems, searchQuery);

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    if (qrIdentifier) {
      dispatch(fetchMenu(qrIdentifier));
    }
  }, [dispatch, qrIdentifier]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      if (!activeCategoryId) {
        setActiveCategoryId(categories[0]._id);
      }
      const allOpen = {};
      categories.forEach((cat) => (allOpen[cat._id] = true));
      setOpenCategories(allOpen);
    }
  }, [categories, activeCategoryId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-600">
        <p>Loading menu...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  if (!shops)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-500">
        <p>No shop found for this QR code. Please check the URL.</p>
      </div>
    );

  return (
    <div className="bg-white text-gray-800 min-h-screen pb-24">
      <TopBar shopName={shops.name} shopAddress={shops.address} table={table} />

      {/* CATEGORY SCROLLER */}
      {!searchQuery && (
        <div className="sticky top-[50px] z-20 bg-white border-b border-gray-200 px-3 overflow-x-auto shadow-sm">
          <div className="flex space-x-3 py-3">
            {(categories || []).map((category) => (
              <div
                key={category._id}
                onClick={() => scrollToCategory(category._id)}
                className="flex flex-col items-center cursor-pointer flex-shrink-0"
              >
                <div
                  className={`w-16 h-14 flex items-center justify-center rounded-xl border text-lg transition-all duration-300 ${
                    activeCategoryId === category._id
                      ? "bg-[#B4161B] text-white border-[#B4161B] shadow-[0_2px_10px_rgba(180,22,27,0.3)]"
                      : "bg-[#FAFAFA] text-gray-600 border-gray-200 hover:border-[#B4161B]"
                  }`}
                >
                  {category.icon || "🍔"}
                </div>
                <p
                  className={`mt-1 text-[11px] font-semibold text-center truncate w-16 ${
                    activeCategoryId === category._id
                      ? "text-[#B4161B]"
                      : "text-gray-500"
                  }`}
                >
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MENU CONTENT */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 mt-3">
        {!isFoodCourt && (
          <div className="space-y-6">
            {searchQuery ? (
              <div className="pt-2">
                <h2 className="text-xl font-bold text-[#B4161B] mb-3">
                  Search Results ({filteredItems.length})
                </h2>
                {filteredItems.length > 0 ? (
                  <div className="space-y-2">
                    {filteredItems.map((item) => (
                      <MenuItemCard key={item._id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No items found.</p>
                )}
              </div>
            ) : (
              (categories || []).map((category) => {
                const items = (menuItems || []).filter(
                  (item) => item.category === category._id
                );
                const isOpen = openCategories[category._id];

                return (
                  <div
                    key={category._id}
                    ref={(el) => (categoryRefs.current[category._id] = el)}
                    className="mb-6"
                  >
                    <h2
                      onClick={() => toggleCategory(category._id)}
                      className="cursor-pointer text-xl font-semibold text-[#B4161B] mb-3 flex justify-between items-center"
                    >
                      <span>
                        {category.name}{" "}
                        <span className="text-xs text-gray-400">
                          ({items.length})
                        </span>
                      </span>
                      <span className="text-gray-500 text-sm">
                        {isOpen ? "︿" : "﹀"}
                      </span>
                    </h2>

                    {isOpen && (
                      <div className="space-y-2 bg-[#FAFAFA] rounded-xl p-3 border border-gray-200 shadow-sm">
                        {items.map((item) => (
                          <MenuItemCard key={item._id} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {isFoodCourt && (
          <div className="text-center p-10 bg-[#FAFAFA] rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-semibold text-[#B4161B]">
              Food Court Menu
            </h2>
            <p className="text-gray-500 mt-2">
              Displaying menu items from multiple shops.
            </p>
          </div>
        )}
      </div>

      <BottomNavBar />
      <FloatingCartButton />
    </div>
  );
};

export default MenuPage;

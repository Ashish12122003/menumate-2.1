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
      <div className="flex justify-center items-center h-screen bg-[#110D09] text-gray-300">
        <p>Loading menu...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-[#110D09] text-red-400">
        <p>Error: {error}</p>
      </div>
    );

  if (!shops)
    return (
      <div className="flex justify-center items-center h-screen bg-[#110D09] text-gray-400">
        <p>No shop found for this QR code. Please check the URL.</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-[#211B14] to-[#110D09] text-gray-200 min-h-screen pb-24">
      <TopBar shopName={shops.name} shopAddress={shops.address} table={table} />

      {/* CATEGORY SCROLLER */}
      {!searchQuery && (
        <div className="sticky top-[50px] z-20 bg-[#211B14]/90 backdrop-blur-md px-3 border-b border-white/10 overflow-x-auto">
          <div className="flex space-x-3 py-3">
            {(categories || []).map((category, index) => (
              <div
                key={category._id}
                onClick={() => scrollToCategory(category._id)}
                className="flex flex-col items-center cursor-pointer flex-shrink-0"
              >
                <div
                  className={`w-16 h-14 flex items-center justify-center rounded-xl border text-lg transition-all duration-300 ${
                    activeCategoryId === category._id
                      ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                      : "bg-gray-600/10 border-gray-600/20 text-gray-300 hover:bg-gray-600/20"
                  }`}
                >
                  {category.icon || [<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-soup"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1z" /><path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /><path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /><path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /></svg>][index % 1]}
                </div>
                <p
                  className={`mt-1 text-[11px] font-semibold text-center truncate w-16 ${
                    activeCategoryId === category._id
                      ? "text-amber-400"
                      : "text-gray-400"
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
                <h2 className="text-xl font-bold text-amber-400 mb-3">
                  Search Results ({filteredItems.length})
                </h2>
                {filteredItems.length > 0 ? (
                  <div className="space-y-1">
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
                      className="cursor-pointer text-xl font-semibold text-amber-400 mb-3 flex justify-between items-center"
                    >
                      <span>
                        {category.name}{" "}
                        <span className="text-xs text-gray-400">
                          ({items.length})
                        </span>
                      </span>
                      <span className="text-gray-400 text-sm">
                        {isOpen ? "︿" : "﹀"}
                      </span>
                    </h2>

                    {isOpen && (
                      <div className="space-y-1 bg-black/20 rounded-xl p-3 border border-white/10">
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
          <div className="text-center p-10 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
            <h2 className="text-3xl font-semibold text-amber-400">
              Food Court Menu
            </h2>
            <p className="text-gray-300 mt-2">
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

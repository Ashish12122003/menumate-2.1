// src/pages/MenuPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuSlice";
import MenuItemCard from "../components/molecules/MenuItemCard";
import FloatingCartButton from "../components/atoms/FloatingCartButton";
import TopBar from "../components/organisms/TopBar";
// 1. New Import: Placeholder for the Bottom Navigation Bar
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

  // --- SCROLL LOGIC ---
  const scrollToCategory = (id) => {
    const element = categoryRefs.current[id];
    if (element) {
      // Adjusted offset to account for TopBar (64px) + Category Navigation (~68px)
      // We'll use 135px to ensure the category title is clearly visible below the sticky navs
      const offset = 135; 
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveCategoryId(id);
    }
  };

  // --- SEARCH FILTER ---
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

  // Fetch menu data
  useEffect(() => {
    if (qrIdentifier) {
      dispatch(fetchMenu(qrIdentifier));
    }
  }, [dispatch, qrIdentifier]);

  // Set default active + open all categories by default
  useEffect(() => {
    if (categories && categories.length > 0) {
      if (!activeCategoryId) {
        setActiveCategoryId(categories[0]._id);
      }
      const allOpen = {};
      categories.forEach((cat) => {
        allOpen[cat._id] = true;
      });
      setOpenCategories(allOpen);
    }
  }, [categories, activeCategoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!shops) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <p>No shop found for this QR code. Please check the URL.</p>
      </div>
    );
  }

  return (
    // Note: Added pb-20 to the container to ensure content is visible above the fixed bottom bar.
    <div className="bg-gray-50 min-h-screen pb-20"> 
      {/* Top Bar (Sticky) */}
      <TopBar shopName={shops.name} shopAddress={shops.address} table={table}/>

      {/* Category Navigation (Square with Icon + Label) - Sticky */}
      {!searchQuery && (
        <div className="sticky top-[64px] z-20 bg-white px-2 overflow-x-auto shadow-md border-b border-gray-200">
          <div className="flex space-x-6 py-3">
            {(categories || []).map((category, index) => (
              <div
                key={category._id}
                className="flex flex-col items-center cursor-pointer flex-shrink-0" // Added flex-shrink-0
                onClick={() => scrollToCategory(category._id)}
              >
                {/* Square Box with Icon */}
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all 
                  ${
                    activeCategoryId === category._id
                      ? "bg-green-800 border-green-900 text-white shadow-md"
                      : "bg-orange-50 border-orange-300 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {/* Placeholder Icon (replace with category.icon if exists) */}
                  <span className="text-xl">
                    {category.icon || ["🍔", "🍕", "🥤", "🍰", "🥗"][index % 5]}
                  </span>
                </div>

                {/* Category Name below square */}
                <p
                  className={`mt-2 text-xs font-medium text-center w-16 truncate 
                    ${
                      activeCategoryId === category._id
                        ? "text-green-900"
                        : "text-gray-600"
                    }`}
                >
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="container mx-auto p-4 md:px-8 lg:px-12">
        {!isFoodCourt && (
          <div className="space-y-4">
            {/* Case 1: Search results */}
            {searchQuery ? (
              <div className="mb-8 pt-4">
                <h2 className="text-xl font-bold text-secondary mb-4">
                  Search Results ({filteredItems.length})
                </h2>
                {filteredItems.length > 0 ? (
                  <div className="flex flex-col space-y-2 bg-white rounded-lg shadow-md p-4">
                    {filteredItems.map((item) => (
                      <MenuItemCard key={item._id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            ) : (
              // Case 2: Normal category-wise rendering
              (categories || []).map((category) => {
                const items = (menuItems || []).filter(
                  (item) => item.category === category._id
                );
                const isOpen = openCategories[category._id];

                return (
                  <div
                    key={category._id}
                    ref={(el) => (categoryRefs.current[category._id] = el)}
                    className="mb-8 pt-4"
                  >
                    <h2
                      onClick={() => toggleCategory(category._id)}
                      className="cursor-pointer text-xl font-bold text-secondary mb-4 flex justify-between items-center"
                    >
                      {category.name} ({items.length})
                      <span className="text-gray-400 transform transition-transform duration-200">
                        {isOpen ? <span className="text-lg">▲</span> : <span className="text-lg">▼</span>}
                      </span>
                    </h2>

                    {isOpen && (
                      <div className="flex flex-col space-y-2 bg-white rounded-lg shadow-md p-4">
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
          <div className="text-center p-10 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-accent">Food Court Menu</h2>
            <p className="text-gray-600 mt-2">
              Displaying menu items from multiple shops.
            </p>
          </div>
        )}
      </div>

      
      
      {/* 2. New Component Placement */}
      <BottomNavBar /> 
      <FloatingCartButton />
    </div>
  );
};

export default MenuPage;
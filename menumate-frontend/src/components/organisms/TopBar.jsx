// src/components/organisms/TopBar.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { setSearchQuery } from "../../features/menu/menuSlice";

const TopBar = ({ shopName, shopAddress, table }) => {
  const dispatch = useDispatch();
  const itemCount = useSelector((state) => state.cart.totalItems);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedQuery.trim()));
  }, [debouncedQuery, dispatch]);

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-[#211B14] to-[#110D09] backdrop-blur-sm py-3 px-4 border-b border-white/10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Left: Shop Name */}
        <div className="text-sm sm:text-base font-semibold text-amber-400 truncate max-w-[150px] sm:max-w-[200px]">
          {shopName}
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-sm mx-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search item"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 text-xs sm:text-sm border border-amber-500/50 rounded-full bg-[#1d1d1d] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Right: Table Info */}
        <div className="flex items-center space-x-2">
          {table && (
            <div className="text-[10px] sm:text-xs font-bold text-[#1a1a1a] bg-amber-400 rounded-full px-2 py-1 flex items-center justify-center shadow-md shadow-amber-800/40">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="15"  height="15"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-building-bridge-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6a3 3 0 0 1 3 3v9a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-2a3 3 0 0 0 -6 0v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-9a3 3 0 0 1 3 -3z" /></svg> {table.tableNumber}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

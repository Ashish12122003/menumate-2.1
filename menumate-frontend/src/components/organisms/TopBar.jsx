// src/components/organisms/TopBar.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaSearch, FaShoppingBasket } from "react-icons/fa";
import { setSearchQuery } from "../../features/menu/menuSlice";
import { Link } from "react-router-dom"; 

// Update props to include 'table'
const TopBar = ({ shopName, shopAddress, table }) => {
    const dispatch = useDispatch();
    const itemCount = useSelector((state) => state.cart.totalItems);

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    
    // Debounce input logic (remains the same)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);
        return () => clearTimeout(handler);
    }, [query]);

    // Dispatch search to Redux when debounce settles (remains the same)
    useEffect(() => {
        dispatch(setSearchQuery(debouncedQuery.trim()));
    }, [debouncedQuery, dispatch]);

    return (
        <header className="sticky top-0 z-20 bg-white shadow-md py-5 px-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                
                {/* Left: Brand Logo + Shop Name */}
                <div className="flex items-center space-x-2">
                    <div className="text-lg font-extrabold text-secondary">{shopName}</div>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-md mx-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search item"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-1.5 border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                </div>

                {/* Right: Table Info & Cart Icon */}
                <div className="flex items-center space-x-4">
                    
                    {/* Display Table Number prominently */}
                    {table && (
                        <div className="text-sm font-bold text-white bg-green-900 border border-green-900 rounded-full px-3 py-1">
                             🍽️ {table.tableNumber}
                        </div>
                    )}  
                
                </div>
            </div>

            {/* Shop Info (Mobile only) - Added Table Info for Mobile */}
            
        </header>
    );
};

export default TopBar;
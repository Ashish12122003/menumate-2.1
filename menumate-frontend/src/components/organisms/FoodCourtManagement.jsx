// src/components/organisms/FoodCourtManagement.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFoodCourts, createNewFoodCourt } from "../../features/admin/adminSlice";

const FoodCourtManagement = () => {
  const dispatch = useDispatch();
  const { foodCourts, loading, error } = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    dispatch(fetchAllFoodCourts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewFoodCourt({ name, address, city: "Surat" }));
    setName('');
    setAddress('');
  };

  if (loading) {
    return <p className="text-center text-olive-600 font-medium animate-pulse">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 font-medium">{error}</p>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <h2 className="text-3xl font-bold text-olive-700 border-b border-olive-300 pb-2">
        Manage Food Courts
      </h2>

      {/* Create Food Court Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-olive-600">
        <h3 className="text-xl font-semibold text-olive-800 mb-4">
          Create New Food Court
        </h3>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Food Court Name"
            className="bg-orange-50 flex-1 border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300 shadow-sm placeholder-gray-400"
            required
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="bg-orange-50 flex-1 border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300 shadow-sm placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-green-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105"
          >
            + Create
          </button>
        </form>
      </div>

      {/* Existing Food Courts List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-olive-500">
        <h3 className="text-2xl font-bold text-olive-800 mb-4">
          Current Food Courts
        </h3>
        <ul className="divide-y divide-orange-300">
          {(
            foodCourts || []).map((fc => (
              <li
                key={fc._id}
                className="p-4 flex justify-between items-center hover:bg-olive-50 transition rounded-lg"
              >
                <div>
                  <p className="font-semibold text-olive-800">{fc.name}</p>
                  <p className="text-sm text-green-900">{fc.address}</p>
                </div>  
                <span className="bg-green-900 text-xs font-medium border border-green-900 text-white px-2 py-1 rounded-lg">
                  Surat
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FoodCourtManagement;

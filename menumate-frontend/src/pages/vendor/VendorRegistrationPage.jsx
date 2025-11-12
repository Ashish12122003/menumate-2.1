// src/pages/vendor/VendorRegistrationPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginVendorUser } from "../../features/vendor/vendorAuthSlice";
import { registerVendor } from "../../api/vendorService";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

const VendorRegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.vendorAuth);

  if (isAuthenticated) navigate("/vendor/dashboard", { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerVendor({ name, email, number, password });
      const result = await dispatch(loginVendorUser({ email, password }));
      if (loginVendorUser.fulfilled.match(result)) {
        navigate("/vendor/dashboard", { replace: true });
      } else {
        setError(result.payload || "Login failed after registration.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fff4f4] to-[#fffafa] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-[#B4161B]/20 rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-[#B4161B]">MenuMate</h1>
          <h2 className="text-lg text-gray-600 font-medium mt-1">
            Vendor Registration
          </h2>
        </div>

        {error && (
          <div className="bg-[#FFF1F1] text-[#B4161B] border border-[#B4161B]/30 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="you@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="tel"
                id="number"
                placeholder="+91 9876543210"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-2 rounded-full text-white font-semibold transition-all ${
            loading
              ? "bg-[#B4161B]/60 cursor-not-allowed"
              : "bg-[#B4161B] hover:bg-[#D92A2A] shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Registering..." : "Register as Vendor"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            to="/vendor/login"
            className="text-[#B4161B] font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>

        <div className="text-center text-xs text-gray-400 mt-4">
          MenuMate Vendor © 2025
        </div>
      </form>
    </div>
  );
};

export default VendorRegistrationPage;

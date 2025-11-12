// src/pages/vendor/VendorLoginPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginVendorUser } from "../../features/vendor/vendorAuthSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const VendorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.vendorAuth
  );

  const from = location.state?.from || "/vendor/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    const saved = localStorage.getItem("vendor_remember_email");
    if (saved) setEmail(saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginVendorUser({ email, password }));
      if (loginVendorUser.fulfilled.match(result)) {
        remember
          ? localStorage.setItem("vendor_remember_email", email)
          : localStorage.removeItem("vendor_remember_email");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fff4f4] to-[#fffafa] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-[#B4161B]/20 rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-[#B4161B]">Vendor Portal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your café & outlet dashboard securely
          </p>
        </div>

        {error && (
          <div className="bg-[#FFF1F1] text-[#B4161B] border border-[#B4161B]/30 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="vendor-email"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="vendor-email"
            type="email"
            placeholder="you@restaurant.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="vendor-password"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="vendor-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-[#B4161B]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-[#B4161B]"
            />
            Remember me
          </label>
          <Link
            to="/vendor/forgot-password"
            className="text-[#B4161B] font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full text-white font-semibold transition-all ${
            loading
              ? "bg-[#B4161B]/60 cursor-not-allowed"
              : "bg-[#B4161B] hover:bg-[#D92A2A] shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600">
          Need an account?{" "}
          <Link
            to="/vendor/register"
            className="text-[#B4161B] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-4">
          MenuMate Vendor © 2025
        </div>
      </form>
    </div>
  );
};

export default VendorLoginPage;

// src/pages/admin/AdminLoginPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginAdminUser } from "../../features/admin/adminAuthSlice";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.adminAuth
  );

  const from = location.state?.from || "/admin/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginAdminUser({ email, password }));
    if (loginAdminUser.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
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
          <h1 className="text-3xl font-bold text-[#B4161B]">MenuMate Admin</h1>
          <h2 className="text-lg text-gray-600 font-medium mt-1">
            Secure Login Portal
          </h2>
        </div>

        {error && (
          <div className="bg-[#FFF1F1] text-[#B4161B] border border-[#B4161B]/30 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}

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
              placeholder="admin@menumate.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4161B]/80 text-gray-800"
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
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-2">
          New admin?{" "}
          <Link
            to="/admin/register"
            className="text-[#B4161B] font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>

        <div className="text-center text-xs text-gray-400 mt-4">
          MenuMate Admin Portal © 2025
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;

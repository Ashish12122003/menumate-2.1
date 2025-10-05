// src/pages/admin/AdminLoginPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAdminUser } from "../../features/admin/adminAuthSlice";

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

  // redirect after login
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

  // ---------- inline styles ----------
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg,#111827 0%,#030712 100%)",
    padding: 24,
    boxSizing: "border-box",
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 480,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e6eef8",
    backdropFilter: "blur(6px)",
  };

  const headerStyle = {
    marginBottom: 20,
    fontSize: 26,
    fontWeight: 700,
    textAlign: "center",
    color: "#fff",
  };

  const fieldStyle = { marginBottom: 16, display: "flex", flexDirection: "column" };

  const labelStyle = {
    fontSize: 13,
    marginBottom: 6,
    color: "#cbd5e1",
    fontWeight: 600,
  };

  const inputStyle = {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    fontSize: 15,
    outline: "none",
  };

  const errorStyle = {
    background: "rgba(255,72,66,0.08)",
    color: "#ffb4b4",
    border: "1px solid rgba(255,72,66,0.2)",
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 13,
    textAlign: "center",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(90deg,#2563eb 0%,#4f46e5 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(37,99,235,0.25)",
    transition: "all 0.2s ease",
  };

  const buttonDisabled = {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={headerStyle}>Admin Login</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={fieldStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="admin@company.com"
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: 44 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: "#cbd5e1",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ ...buttonStyle, ...(loading ? buttonDisabled : {}) }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;

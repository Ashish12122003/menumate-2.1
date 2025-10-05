// src/pages/vendor/VendorLoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginVendorUser } from '../../features/vendor/vendorAuthSlice';

const VendorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.vendorAuth);

  const from = location.state?.from || '/vendor/dashboard';

  // Redirect if already authenticated (useEffect avoids navigating during render)
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginVendorUser({ email: email.trim(), password }));
      if (loginVendorUser.fulfilled.match(resultAction)) {
        // Optionally persist remember preference
        if (remember) {
          localStorage.setItem('vendor_remember_email', email.trim());
        } else {
          localStorage.removeItem('vendor_remember_email');
        }
        navigate(from, { replace: true });
      }
    } catch (err) {
      // error handled by slice; no-op here
      console.error('Login error', err);
    }
  };

  useEffect(() => {
    // hydrate remembered email if present
    const saved = localStorage.getItem('vendor_remember_email');
    if (saved) setEmail(saved);
  }, []);

  // ---------- Inline style objects ----------
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #0f172a 0%, #071024 100%)',
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  };

  const cardStyle = {
    width: '100%',
    maxWidth: 520,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 10px 30px rgba(2,6,23,0.7)',
    border: '1px solid rgba(255,255,255,0.04)',
    color: '#e6eef8',
    backdropFilter: 'blur(6px)',
  };

  const headerStyle = {
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: -0.2,
    margin: 0,
    color: '#fff',
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: 13,
    color: '#b8c6d9',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
  };

  const labelStyle = {
    fontSize: 13,
    marginBottom: 8,
    color: '#b8c6d9',
    fontWeight: 600,
  };

  const inputBase = {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    color: '#e6eef8',
    fontSize: 15,
    outline: 'none',
    transition: 'box-shadow 160ms ease, border-color 160ms ease, transform 120ms ease',
    boxSizing: 'border-box',
  };

  const inputFocus = {
    boxShadow: '0 6px 18px rgba(2,6,23,0.55)',
    border: '1px solid rgba(99,102,241,0.9)', // indigo accent
    transform: 'translateY(-1px)',
  };

  const smallRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 13,
    marginBottom: 12,
    color: '#9fb0d3',
  };

  const checkboxLabel = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#b8c6d9',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 999,
    border: 'none',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(99,102,241,0.18)',
    transition: 'transform 140ms ease, box-shadow 140ms ease, opacity 120ms ease',
  };

  const buttonDisabled = {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  };

  const helperText = {
    fontSize: 13,
    color: '#9fb0d3',
  };

  const errorStyle = {
    background: 'linear-gradient(90deg, rgba(255,72,66,0.08), rgba(255,72,66,0.04))',
    color: '#ffb4b4',
    border: '1px solid rgba(255,72,66,0.12)',
    padding: '10px 12px',
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 13,
  };

  // ---------- helper for applying focus styles without CSS ----------
  const applyFocus = (e) => {
    Object.assign(e.target.style, inputFocus);
  };
  const removeFocus = (e) => {
    Object.assign(e.target.style, inputBase);
  };

  return (
    <div style={pageStyle}>
      <form aria-label="Vendor login form" onSubmit={handleSubmit} style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Vendor Portal</h1>
            <p style={subtitleStyle}>Secure access for your cafe / outlet management</p>
          </div>
          <div aria-hidden style={{ textAlign: 'right', fontSize: 12, color: '#7f97bf' }}>
            v1.0
          </div>
        </div>

        {error && <div role="alert" style={errorStyle}>{error}</div>}

        <div style={fieldStyle}>
          <label htmlFor="vendor-email" style={labelStyle}>Email</label>
          <input
            id="vendor-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={applyFocus}
            onBlur={removeFocus}
            style={inputBase}
            placeholder="you@restaurant.com"
            required
            autoComplete="email"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="vendor-password" style={labelStyle}>Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              id="vendor-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={applyFocus}
              onBlur={removeFocus}
              style={{ ...inputBase, paddingRight: 44 }}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: 'absolute',
                right: 8,
                height: 34,
                width: 34,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: '#cfe3ff',
                cursor: 'pointer',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 120ms ease',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div style={smallRow}>
          <label style={checkboxLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: 16, height: 16, borderRadius: 4, margin: 0 }}
            />
            <span>Remember me</span>
          </label>

          <a
            href="/vendor/forgot-password"
            style={{ color: '#cfe3ff', textDecoration: 'none', fontSize: 13 }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Forgot password?
          </a>
        </div>

        <div style={{ marginBottom: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ ...buttonStyle, ...(loading ? buttonDisabled : {}) }}
            onMouseDown={(e) => (e.currentTarget.style.transform = loading ? '' : 'translateY(1px)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = '')}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <p style={helperText}>
            Need an account?{' '}
            <a
              href="/vendor/register"
              style={{ color: '#e6f0ff', fontWeight: 700, textDecoration: 'none' }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default VendorLoginPage;

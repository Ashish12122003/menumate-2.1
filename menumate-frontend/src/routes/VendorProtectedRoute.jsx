// src/routes/VendorProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const VendorProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.vendorAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/vendor/login" state={{ from: location }} replace />;
  }

  return children;
};

export default VendorProtectedRoute;
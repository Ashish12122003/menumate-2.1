// src/routes/AdminProtectedRoute.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.adminAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
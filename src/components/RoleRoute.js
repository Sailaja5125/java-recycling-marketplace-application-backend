import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role || 'USER';

  if (!allowedRoles.includes(userRole)) {
    // If user is logged in but doesn't have the right role, redirect to their home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;

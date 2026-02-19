import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Recycling Marketplace Home">
          <span className="logo-icon" aria-hidden="true">♻️</span>
          <span>RecycleMarket</span>
        </Link>
        
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" aria-label="Go to dashboard">
                Dashboard
              </Link>
              <Link to="/products" className="nav-link" aria-label="View all products">
                Products
              </Link>
              <Link to="/orders" className="nav-link" aria-label="View my orders">
                My Orders
              </Link>
              <div className="user-info">
                <span className="user-name" aria-label={`Logged in as ${user?.username || user?.email}`}>
                  {user?.username || user?.email}
                </span>
                <span className="rewards-badge" aria-label={`You have ${user?.rewards || 0} reward points`}>
                  {user?.rewards || 0} Points
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" aria-label="Login to your account">
                Login
              </Link>
              <Link to="/signup" className="btn-primary" aria-label="Create a new account">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

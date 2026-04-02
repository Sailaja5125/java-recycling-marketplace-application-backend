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
              {(!user?.role || user?.role === 'USER') && (
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/products" className="nav-link">Products</Link>
                  <Link to="/orders" className="nav-link">My Orders</Link>
                </>
              )}
              {user?.role === 'SELLER' && (
                <>
                  <Link to="/seller-dashboard" className="nav-link">Seller Dashboard</Link>
                  <Link to="/products" className="nav-link">Marketplace</Link>

                </>
              )}
              {user?.role === 'DELIVERY_BOY' && (
                <Link to="/delivery-tasks" className="nav-link">Delivery Tasks</Link>
              )}
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

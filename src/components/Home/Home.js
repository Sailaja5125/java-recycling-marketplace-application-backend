import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-content">
          <h1 id="hero-heading" className="hero-title">
            Welcome to RecycleMarket
          </h1>
          <p className="hero-subtitle">
            Your one-stop marketplace for recycling materials and earning rewards
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/signup" className="btn-hero btn-primary" aria-label="Create a new account">
                Get Started
              </Link>
              <Link to="/login" className="btn-hero btn-secondary" aria-label="Login to your account">
                Login
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn-hero btn-primary" aria-label="Go to dashboard">
                Go to Dashboard
              </Link>
              <Link to="/products" className="btn-hero btn-secondary" aria-label="Browse products">
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">📦</div>
            <h3 className="feature-title">Schedule Pickup</h3>
            <p className="feature-description">
              Schedule a pickup for your recyclable materials and earn 100 reward points
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">🏆</div>
            <h3 className="feature-title">Earn Rewards</h3>
            <p className="feature-description">
              Accumulate reward points with every successful pickup you schedule
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">🛒</div>
            <h3 className="feature-title">Shop Products</h3>
            <p className="feature-description">
              Use your reward points to purchase eco-friendly products made from recycled materials
            </p>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="quick-stats" aria-label="Your account summary">
          <div className="stat-card">
            <div className="stat-value">{user?.rewards || 0}</div>
            <div className="stat-label">Reward Points</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{user?.username || 'User'}</div>
            <div className="stat-label">Account</div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

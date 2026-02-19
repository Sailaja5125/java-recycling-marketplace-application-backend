import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userDetailsAPI, authAPI } from '../../services/api';
import PickupForm from './PickupForm';
import RewardsDisplay from './RewardsDisplay';
import PickupHistory from './PickupHistory';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [pickupDetails, setPickupDetails] = useState([]);
  const [rewards, setRewards] = useState(user?.rewards || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  const loadUserData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [detailsResponse, rewardsResponse] = await Promise.all([
        userDetailsAPI.getUserDetails(user.id),
        authAPI.getRewards(user.id),
      ]);

      setPickupDetails(detailsResponse.data);
      setRewards(rewardsResponse.data.rewards);
      
      // Update user in context
      updateUser({ ...user, rewards: rewardsResponse.data.rewards });
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePickupSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await userDetailsAPI.add(formData, user.id);
      await loadUserData(); // Reload to get updated rewards
    } catch (err) {
      setError(err.response?.data || 'Failed to submit pickup request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.username || "John Doe"}!</h1>
        <p className="dashboard-subtitle">Manage your recycling pickups and track your rewards</p>
      </div>

      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-main">
          <section className="dashboard-section" aria-labelledby="pickup-form-heading">
            <h2 id="pickup-form-heading">Schedule a Pickup</h2>
            <PickupForm onSubmit={handlePickupSubmit} loading={loading} />
          </section>

          <section className="dashboard-section" aria-labelledby="pickup-history-heading">
            <h2 id="pickup-history-heading">Pickup History</h2>
            <PickupHistory
              pickups={pickupDetails}
              loading={loading}
              onRefresh={loadUserData}
            />
          </section>
        </div>

        <aside className="dashboard-sidebar" aria-label="Rewards information">
          <RewardsDisplay rewards={rewards} />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

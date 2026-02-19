import React from 'react';
import './Dashboard.css';

const RewardsDisplay = ({ rewards }) => {
  return (
    <div className="rewards-card">
      <div className="rewards-header">
        <h3 className="rewards-title">Your Rewards</h3>
        <span className="rewards-icon" aria-hidden="true">🏆</span>
      </div>
      <div className="rewards-amount" aria-label={`You have ${rewards} reward points`}>
        {rewards.toLocaleString()}
      </div>
      <p className="rewards-subtitle">Points Available</p>
      <div className="rewards-info">
        <p className="info-text">
          <strong>Earn Points:</strong> Schedule a pickup to earn 100 points
        </p>
        <p className="info-text">
          <strong>Spend Points:</strong> Use points to purchase recycled products
        </p>
      </div>
    </div>
  );
};

export default RewardsDisplay;

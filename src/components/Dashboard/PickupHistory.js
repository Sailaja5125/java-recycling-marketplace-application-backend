import React from 'react';
import { format } from 'date-fns';
import './Dashboard.css';

const PickupHistory = ({ pickups, loading, onRefresh }) => {
  if (loading && pickups.length === 0) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <p>Loading pickup history...</p>
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <div className="empty-state">
        <p>No pickup requests yet. Schedule your first pickup above!</p>
      </div>
    );
  }

  return (
    <div className="pickup-history">
      <div className="history-header">
        <h3>Recent Pickups</h3>
        <button
          onClick={onRefresh}
          className="btn-refresh"
          aria-label="Refresh pickup history"
        >
          Refresh
        </button>
      </div>
      <div className="pickup-list" role="list">
        {pickups.map((pickup) => (
          <div key={pickup.id} className="pickup-item" role="listitem">
            <div className="pickup-item-header">
              <span className="pickup-date">
                {pickup.pickupTime
                  ? format(new Date(pickup.pickupTime), 'MMM dd, yyyy h:mm a')
                  : 'Scheduled'}
              </span>
              <span className="pickup-quantity">{pickup.quantity} kg</span>
            </div>
            <div className="pickup-address">
              <strong>Address:</strong> {pickup.address}
            </div>
            {pickup.materials && pickup.materials.length > 0 && (
              <div className="pickup-materials">
                <strong>Materials:</strong>
                <div className="materials-list">
                  {pickup.materials.map((material, index) => (
                    <span key={index} className="material-tag">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pickup-status" style={{ marginTop: '10px' }}>
              <strong>Status:</strong> {pickup.status || 'PENDING'}
              {pickup.status === 'ASSIGNED' && pickup.completionToken && (
                <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#e8f0fe', borderRadius: '4px' }}>
                  <strong>Delivery OTP (Share with delivery partner):</strong> <span style={{fontSize: '1.2em', letterSpacing: '2px', fontWeight: 'bold'}}>{pickup.completionToken}</span>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickupHistory;

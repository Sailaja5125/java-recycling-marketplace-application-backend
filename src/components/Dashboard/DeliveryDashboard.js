import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userDetailsAPI, ordersAPI } from '../../services/api';
import './Dashboard.css';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [pendingPickups, setPendingPickups] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadAllTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadAllTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const [assignedPickupsRes, pendingPickupsRes, assignedOrdersRes, pendingOrdersRes] = await Promise.all([
        userDetailsAPI.getAssignedPickups(user.id),
        userDetailsAPI.getPendingPickups(),
        ordersAPI.getAssignedOrders(user.id),
        ordersAPI.getPendingOrders()
      ]);
      setAssignedPickups(assignedPickupsRes.data);
      setPendingPickups(pendingPickupsRes.data);
      setAssignedOrders(assignedOrdersRes.data);
      setPendingOrders(pendingOrdersRes.data);
    } catch (err) {
      setError('Failed to load delivery tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id, type) => {
    try {
      if (type === 'PICKUP') {
        await userDetailsAPI.assignDelivery(id, user.id);
      } else {
        await ordersAPI.assignDelivery(id, user.id);
      }
      alert(`You have successfully claimed this ${type.toLowerCase()} task!`);
      loadAllTasks();
    } catch (err) {
      alert(err.response?.data || 'Failed to claim task.');
    }
  };

  const handleComplete = async (id, type) => {
    const token = window.prompt("Enter the 6-digit OTP provided by the customer:");
    if (!token) return;

    try {
      if (type === 'PICKUP') {
        await userDetailsAPI.completeDelivery(id, token);
      } else {
        await ordersAPI.completeDelivery(id, token);
      }
      alert('Delivery marked as complete!');
      loadAllTasks();
    } catch (err) {
      alert(err.response?.data || 'Failed to complete delivery. Invalid OTP.');
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p>Loading tasks...</p></div>;
  }

  const renderTable = (items, type, isPending) => (
    <div className="table-responsive">
      <table style={{ width: '100%', textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Type</th>
            <th style={{ padding: '10px' }}>Description</th>
            <th style={{ padding: '10px' }}>Quantity</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const status = type === 'PICKUP' ? item.status : item.deliveryStatus;
            return (
              <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>#{item.id}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8em',
                    backgroundColor: type === 'PICKUP' ? '#e8f5e9' : '#e3f2fd',
                    color: type === 'PICKUP' ? '#2e7d32' : '#1565c0',
                    fontWeight: 'bold'
                  }}>
                    {type}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {type === 'PICKUP' ? (
                    <>
                      <strong>Pickup:</strong> {item.materials?.join(', ')} <br/>
                      <small>{item.address}</small>
                    </>
                  ) : (
                    <>
                      <strong>Order:</strong> {item.productName} <br/>
                      <small>Customer ID: {item.userId}</small>
                    </>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  {item.quantity} {type === 'PICKUP' ? 'kg' : 'units'}
                </td>
                <td style={{ padding: '10px' }}>
                  {isPending ? (
                    <button onClick={() => handleClaim(item.id, type)} style={{ padding: '6px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Claim</button>
                  ) : (
                    status === 'ASSIGNED' ? (
                      <button onClick={() => handleComplete(item.id, type)} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enter OTP</button>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>{status}</span>
                    )
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Delivery Dashboard</h1>
        <p>Welcome, Delivery Partner {user?.username || user?.email}!</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="dashboard-section">
        <h2>My Active Tasks</h2>
        {assignedPickups.length === 0 && assignedOrders.length === 0 ? (
          <p>No tasks currently assigned to you.</p>
        ) : (
          <>
            {assignedPickups.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3>Material Pickups</h3>
                {renderTable(assignedPickups, 'PICKUP', false)}
              </div>
            )}
            {assignedOrders.length > 0 && (
              <div>
                <h3>Product Orders</h3>
                {renderTable(assignedOrders, 'PRODUCT', false)}
              </div>
            )}
          </>
        )}
      </section>

      <section className="dashboard-section" style={{ marginTop: '40px' }}>
        <h2>Available Pending Tasks</h2>
        <p>Claim nearby tasks below:</p>
        {pendingPickups.length === 0 && pendingOrders.length === 0 ? (
          <p>No pending tasks available.</p>
        ) : (
          <>
            {pendingPickups.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3>Available Pickups</h3>
                {renderTable(pendingPickups, 'PICKUP', true)}
              </div>
            )}
            {pendingOrders.length > 0 && (
              <div>
                <h3>Available Product Deliveries</h3>
                {renderTable(pendingOrders, 'PRODUCT', true)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default DeliveryDashboard;

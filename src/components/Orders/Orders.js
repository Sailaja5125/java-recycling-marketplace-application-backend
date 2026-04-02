import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';
import OrderCard from './OrderCard';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const loadOrders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getUserOrders(user.id);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Points will be refunded.')) {
      return;
    }

    try {
      await ordersAPI.cancelOrder(orderId);
      await loadOrders(); // Reload orders
      // Reload user to update rewards
      window.location.reload(); // Simple way to refresh user data
    } catch (err) {
      alert(err.response?.data || 'Failed to cancel order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-container" role="status" aria-live="polite">
          <div className="spinner" aria-label="Loading orders"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">View and manage your product orders</p>
      </div>

      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          {error}
          <button
            onClick={loadOrders}
            className="btn-retry"
            aria-label="Retry loading orders"
          >
            Retry
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <p>Browse our products and start shopping!</p>
        </div>
      ) : (
        <>
          <div className="orders-summary">
            <p>
              You have <strong>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="orders-list" role="list" aria-label="Your orders">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancelOrder}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;

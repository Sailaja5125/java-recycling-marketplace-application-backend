import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sellerAPI, productsAPI } from '../../services/api';
import AddProductForm from './AddProductForm';
import './Dashboard.css';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.email) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await sellerAPI.getOrders(user.email);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load your product orders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Append sellerId to the FormData provided by the child component
      productData.append('sellerId', user.email);

      await productsAPI.add(productData);
      setSuccess('Product added successfully to your inventory!');
      setShowAddForm(false);
      loadOrders(); // Refresh orders after adding
    } catch (err) {
      setError(err.response?.data || 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0 && !showAddForm) {
    return <div className="loading-container"><div className="spinner"></div><p>Loading your dashboard...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Seller Dashboard</h1>
            <p>Welcome, {user?.name || user?.email}!</p>
          </div>
          <button 
            className={showAddForm ? "btn-secondary" : "btn-primary"}
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSuccess('');
              setError('');
            }}
          >
            {showAddForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>
      </header>

      {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>{success}</div>}

      {showAddForm ? (
        <section className="dashboard-section card animate-in">
          <h2>List a New Product</h2>
          <p className="section-subtitle" style={{ marginBottom: '20px', color: '#666' }}>Fill in the details to add a product to the marketplace</p>
          <AddProductForm onSubmit={handleAddProduct} loading={loading} />
        </section>
      ) : (
        <section className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2>Your Recent Sales</h2>
            <button onClick={loadOrders} className="btn-text" disabled={loading} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
              {loading ? 'Refreshing...' : 'Refresh Orders'}
            </button>
          </div>
          
          {orders.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc', marginTop: '20px' }}>
              <p>No one has bought your products yet.</p>
              <small>Orders will appear here once users purchase your items.</small>
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', textAlign: 'left', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px' }}>Order ID</th>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Qty</th>
                    <th style={{ padding: '10px' }}>Buyer Name</th>
                    <th style={{ padding: '10px' }}>Buyer Email</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.order.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}><strong>#{o.order.id}</strong></td>
                      <td style={{ padding: '10px' }}>{o.order.productName}</td>
                      <td style={{ padding: '10px' }}>{o.order.quantity}</td>
                      <td style={{ padding: '10px' }}>{o.buyer?.name || 'Unknown'}</td>
                      <td style={{ padding: '10px' }}>{o.buyer?.email || 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SellerDashboard;

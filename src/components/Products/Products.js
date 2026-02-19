import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import ProductCard from './ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-container" role="status" aria-live="polite">
          <div className="spinner" aria-label="Loading products"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">Recycled Products Marketplace</h1>
        <p className="products-subtitle">
          Browse and purchase products made from recycled materials using your reward points
        </p>
      </div>

      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          {error}
          <button
            onClick={loadProducts}
            className="btn-retry"
            aria-label="Retry loading products"
          >
            Retry
          </button>
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No products available at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="products-grid" role="list" aria-label="Products list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

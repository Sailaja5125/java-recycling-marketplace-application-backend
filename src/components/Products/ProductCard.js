import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';
import './Products.css';

const ProductCard = ({ product }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await ordersAPI.buy({
        userId: user.id,
        productId: product.id,
        quantity: quantity,
      });

      // Update user rewards
      if (response.data.remainingRewards !== undefined) {
        updateUser({ ...user, rewards: response.data.remainingRewards });
      }

      // Show success and navigate to orders
      alert(`Order placed successfully! You spent ${response.data.totalCostPoints} points.`);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalCost = Math.ceil(product.price * quantity);
  const canAfford = user?.rewards >= totalCost;
  const inStock = product.quantity > 0;

  return (
    <article className="product-card" role="listitem">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="product-image"
          loading="lazy"
        />
      ) : (
        <div className="product-image-placeholder" aria-hidden="true">
          ♻️
        </div>
      )}

      <div className="product-content">
        <h3 className="product-name">{product.productName}</h3>
        
        {product.productDetails && (
          <p className="product-details">{product.productDetails}</p>
        )}

        <div className="product-info">
          <div className="product-price">
            <span className="price-label">Price:</span>
            <span className="price-value" aria-label={`${product.price} points per unit`}>
              {product.price} pts/unit
            </span>
          </div>
          
          <div className="product-stock">
            <span className="stock-label">Stock:</span>
            <span
              className={`stock-value ${inStock ? 'in-stock' : 'out-of-stock'}`}
              aria-label={`${product.quantity} units available`}
            >
              {product.quantity} units
            </span>
          </div>
        </div>

        {error && (
          <div className="product-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {user && inStock && (
          <form onSubmit={handleOrder} className="product-order-form">
            <div className="quantity-selector">
              <label htmlFor={`quantity-${product.id}`} className="quantity-label">
                Quantity:
              </label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                className="quantity-input"
                aria-label={`Select quantity for ${product.productName}`}
              />
            </div>

            <div className="order-summary">
              <span className="total-label">Total:</span>
              <span className="total-cost" aria-label={`Total cost: ${totalCost} points`}>
                {totalCost} points
              </span>
            </div>

            <button
              type="submit"
              className={`btn-order ${!canAfford ? 'btn-disabled' : ''}`}
              disabled={loading || !canAfford || !inStock}
              aria-label={
                !canAfford
                  ? `You need ${totalCost - user.rewards} more points to order`
                  : `Order ${quantity} ${product.productName} for ${totalCost} points`
              }
            >
              {loading
                ? 'Ordering...'
                : !canAfford
                ? `Need ${totalCost - user.rewards} more pts`
                : 'Order Now'}
            </button>
          </form>
        )}

        {!user && (
          <div className="login-prompt">
            <p>Please login to order products</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-login"
              aria-label="Login to order products"
            >
              Login
            </button>
          </div>
        )}

        {!inStock && (
          <div className="out-of-stock-message" role="alert">
            Out of Stock
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;

import './Orders.css';

const OrderCard = ({ order, onCancel }) => {
  const canCancel = order.status === 'PLACED';
  const statusClass = order.status.toLowerCase().replace('_', '-');

  return (
    <article className="order-card" role="listitem">
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-product-name">{order.productName}</h3>
          <span className={`order-status status-${statusClass}`} aria-label={`Order status: ${order.status}`}>
            {order.status}
          </span>
        </div>
        <div className="order-id">
          Order ID: #{order.id}
        </div>
      </div>

      <div className="order-details">
        <div className="order-detail-item">
          <span className="detail-label">Quantity:</span>
          <span className="detail-value">{order.quantity} unit{order.quantity !== 1 ? 's' : ''}</span>
        </div>
        <div className="order-detail-item">
          <span className="detail-label">Total Cost:</span>
          <span className="detail-value cost-value">
            {Math.ceil(order.price)} points
          </span>
        </div>
        {order.productId && (
          <div className="order-detail-item">
            <span className="detail-label">Product ID:</span>
            <span className="detail-value">#{order.productId}</span>
          </div>
        )}
        <div className="order-detail-item" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
          <span className="detail-label">Delivery Status:</span>
          <span className={`detail-value status-${order.deliveryStatus?.toLowerCase()}`}>
            {order.deliveryStatus || 'PENDING'}
          </span>
        </div>
        {order.deliveryStatus === 'ASSIGNED' && order.completionToken && (
          <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#e8f0fe', borderRadius: '8px', border: '1px solid #1a73e8' }}>
            <span style={{ display: 'block', fontSize: '0.85em', color: '#1a73e8', marginBottom: '4px', fontWeight: 'bold' }}>
              DELIVERY OTP (Share with delivery partner)
            </span>
            <span style={{ fontSize: '1.4em', letterSpacing: '4px', fontWeight: 'bold', color: '#174ea6' }}>
              {order.completionToken}
            </span>
          </div>
        )}
      </div>

      {canCancel && (
        <div className="order-actions">
          <button
            onClick={() => onCancel(order.id)}
            className="btn-cancel-order"
            aria-label={`Cancel order ${order.id}`}
          >
            Cancel Order
          </button>
        </div>
      )}
    </article>
  );
};

export default OrderCard;

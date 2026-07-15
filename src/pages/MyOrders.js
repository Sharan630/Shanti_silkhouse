import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiPackage, FiRefreshCw, FiChevronDown, FiChevronUp,
  FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import './MyOrders.css';

const STATUS_STEPS = ['placed', 'confirmed', 'pending', 'processing', 'shipped', 'delivered'];

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const getStatusIndex = (status) => {
  const index = STATUS_STEPS.indexOf(status);
  return index >= 0 ? index : 0;
};

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!user) return;

    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError('');

      const response = await axios.get('/api/orders');
      const parsedOrders = (response.data.orders || []).map(order => ({
        ...order,
        total_amount: Number(order.total_amount),
        items: (order.items || []).filter(item => item && item.id)
      }));
      setOrders(parsedOrders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-orders' } });
      return;
    }
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, [user, fetchOrders]);

  const toggleExpand = (orderId) => {
    setExpandedOrder(prev => (prev === orderId ? null : orderId));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="my-orders">
      <div className="container">
        <div className="my-orders-header">
          <div>
            <h1>My Orders</h1>
            <p>Track your orders and see live status updates</p>
          </div>
          <button
            type="button"
            className="refresh-orders-btn"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {error && <div className="orders-error">{error}</div>}

        {loading ? (
          <div className="orders-loading">
            <FiPackage />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <FiPackage />
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here with live status updates.</p>
            <Link to="/collection/silk-sarees" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const isExpanded = expandedOrder === order.id;
              const statusIndex = getStatusIndex(order.status);
              const isCancelled = order.status === 'cancelled';

              return (
                <div key={order.id} className={`order-card ${isCancelled ? 'cancelled' : ''}`}>
                  <div className="order-card-header">
                    <div className="order-meta">
                      <h3>Order #{order.id}</h3>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="order-badges">
                      <span className={`order-status status-${order.status}`}>
                        {formatStatus(order.status)}
                      </span>
                      <span className={`payment-status status-${order.payment_status}`}>
                        {order.payment_status === 'paid_on_delivery' ? 'Paid on Delivery' : formatStatus(order.payment_status)}
                      </span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="order-progress">
                      {STATUS_STEPS.slice(0, 5).map((step, index) => (
                        <div
                          key={step}
                          className={`progress-step ${index <= statusIndex ? 'completed' : ''} ${index === statusIndex ? 'current' : ''}`}
                        >
                          <div className="step-dot">
                            {index < statusIndex ? <FiCheckCircle /> : index === 0 ? <FiClock /> : <FiTruck />}
                          </div>
                          <span>{formatStatus(step)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="order-summary-row">
                    <div className="order-items-preview">
                      {order.items.slice(0, 2).map(item => (
                        <span key={item.id} className="item-chip">
                          {item.product_name} × {item.quantity}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="item-chip more">+{order.items.length - 2} more</span>
                      )}
                    </div>
                    <div className="order-total">₹{order.total_amount.toLocaleString()}</div>
                  </div>

                  <button
                    type="button"
                    className="toggle-details-btn"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {isExpanded && (
                    <div className="order-details">
                      <div className="details-grid">
                        <div className="detail-block">
                          <h4><FiCreditCard /> Payment</h4>
                          <p><strong>Method:</strong> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</p>
                          <p><strong>Status:</strong> {formatStatus(order.payment_status)}</p>
                        </div>
                        <div className="detail-block">
                          <h4><FiMapPin /> Shipping Address</h4>
                          <p>{order.shipping_address}</p>
                          {order.phone_number && <p><strong>Phone:</strong> {order.phone_number}</p>}
                        </div>
                      </div>

                      <table className="order-items-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map(item => (
                            <tr key={item.id}>
                              <td>{item.product_name}</td>
                              <td>{item.quantity}</td>
                              <td>₹{Number(item.price).toLocaleString()}</td>
                              <td>₹{(Number(item.price) * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3"><strong>Total</strong></td>
                            <td><strong>₹{order.total_amount.toLocaleString()}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

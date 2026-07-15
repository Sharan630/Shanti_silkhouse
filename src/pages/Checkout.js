import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Checkout.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotals, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get real cart totals
  const orderSummary = getCartTotals();

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  // Redirect if guest
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!user) {
      setError('Please log in to place an order');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      
      if (formData.paymentMethod === 'cod') {
        const response = await axios.post('/api/orders', formData);
        setMessage(response.data.message || 'Order placed successfully!');
        await clearCart();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Online Payment - Razorpay
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          setError('Razorpay SDK failed to load. Are you online?');
          setSubmitting(false);
          return;
        }

        let razorpayOrder;
        try {
          const orderRes = await axios.post('/api/orders/razorpay-order');
          razorpayOrder = orderRes.data;
        } catch (err) {
          const errMs = err.response?.data?.message || 'Failed to initiate online payment. Please try again.';
          setError(errMs);
          setSubmitting(false);
          return;
        }

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'Shanti Silk House',
          description: 'Purchase Saree(s)',
          order_id: razorpayOrder.id,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
            method: formData.paymentMethod // card or upi
          },
          handler: async function (response) {
            try {
              const finalOrderData = {
                ...formData,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };
              
              const orderConfirmRes = await axios.post('/api/orders', finalOrderData);
              setMessage(orderConfirmRes.data.message || 'Payment successful and order placed!');
              await clearCart();
              setTimeout(() => {
                navigate('/');
              }, 2000);
            } catch (err) {
              const errMs = err.response?.data?.message || 'Payment verified but order creation failed. Please contact support.';
              setError(errMs);
              setSubmitting(false);
            }
          },
          theme: {
            color: '#b03060'
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              setError('Payment window closed by user.');
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout">
      <div className="container">
        {}
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>

        <div className="checkout-content">
          {}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form" aria-label="Checkout form">
              {}
              <div className="form-section">
                <h2>
                  <FiUser />
                  Personal Information
                </h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="First name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="Last name"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FiMail />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="Email address"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FiPhone />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="Phone number"
                    />
                  </div>
                </div>
              </div>

              {}
              <div className="form-section">
                <h2>
                  <FiMapPin />
                  Shipping Address
                </h2>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-label="Street address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="City"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="State"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-label="ZIP code"
                    />
                  </div>
                </div>
              </div>

              {}
              <div className="form-section">
                <h2>
                  <FiCreditCard />
                  Payment Method
                </h2>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">💳</span>
                      <div>
                        <h4>Credit/Debit Card</h4>
                        <p>Pay securely with your card</p>
                      </div>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">📱</span>
                      <div>
                        <h4>UPI Payment</h4>
                        <p>Pay using UPI apps</p>
                      </div>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">💰</span>
                      <div>
                        <h4>Cash on Delivery</h4>
                        <p>Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                </div>

                {}
                {formData.paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input type="text" placeholder="1234 5678 9012 3456" required aria-required="true" aria-label="Card number" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input type="text" placeholder="MM/YY" required aria-required="true" aria-label="Expiry date" />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input type="text" placeholder="123" required aria-required="true" aria-label="CVV" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input type="text" placeholder="John Doe" required aria-required="true" aria-label="Cardholder name" />
                    </div>
                  </div>
                )}
              </div>

              {}
              <div className="security-notice">
                <FiLock />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {}
              {error && (
                <div style={{ 
                  padding: '15px', 
                  background: '#fee', 
                  color: '#c33', 
                  borderRadius: '8px', 
                  marginBottom: '20px' 
                }}>
                  {error}
                </div>
              )}
              
              {message && (
                <div style={{ 
                  padding: '15px', 
                  background: '#efe', 
                  color: '#3c3', 
                  borderRadius: '8px', 
                  marginBottom: '20px' 
                }}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary place-order-btn"
                disabled={submitting || cartItems.length === 0}
              >
                <FiCheck />
                {submitting ? 'Placing Order...' : `Place Order - ₹${orderSummary.total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              {cartLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p>Loading cart...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p>Your cart is empty</p>
                  <Link to="/collection/silk-sarees" className="btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="order-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-info">
                          <h4>{item.name || 'Product'}</h4>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="item-price">
                          ₹{((item.price || 0) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>₹{orderSummary.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping</span>
                      <span className={orderSummary.shipping === 0 ? "free-shipping" : ""}>
                        {orderSummary.shipping === 0 ? "FREE" : `₹${orderSummary.shipping.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="total-row total">
                      <span>Total</span>
                      <span>₹{orderSummary.total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="order-features">
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <div>
                    <h4>Free Shipping</h4>
                    <p>Delivered in 3-5 business days</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <div>
                    <h4>Secure Payment</h4>
                    <p>Your data is protected</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">↩️</span>
                  <div>
                    <h4>Easy Returns</h4>
                    <p>30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

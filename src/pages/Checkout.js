import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
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

  const [orderSummary] = useState({
    items: [
      { name: "Royal Silk Saree", price: 25000, quantity: 1 },
      { name: "Designer Cotton Saree", price: 12000, quantity: 2 },
      { name: "Party Wear Saree", price: 18000, quantity: 1 }
    ],
    subtotal: 67000,
    shipping: 0,
    total: 67000
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Order submitted:', formData);
  };

  return (
    <div className="checkout">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>

        <div className="checkout-content">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form" aria-label="Checkout form">
              {/* Personal Information */}
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

              {/* Shipping Address */}
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

              {/* Payment Method */}
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

                {/* Card Details */}
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

              {/* Security Notice */}
              <div className="security-notice">
                <FiLock />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary place-order-btn">
                <FiCheck />
                Place Order - ₹{orderSummary.total.toLocaleString()}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
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
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="total-row total">
                  <span>Total</span>
                  <span>₹{orderSummary.total.toLocaleString()}</span>
                </div>
              </div>

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

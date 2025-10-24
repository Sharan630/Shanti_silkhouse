import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiX, FiShoppingBag, FiArrowLeft, FiTruck } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart, getCartTotals } = useCart();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const handleUpdateQuantity = async (cartItemId, change) => {
    const item = cartItems.find(item => item.id === cartItemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    const result = await updateQuantity(cartItemId, newQuantity);
    
    if (result.success) {
      setMessage('Cart updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    const result = await removeFromCart(cartItemId);
    
    if (result.success) {
      setMessage('Item removed from cart');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const result = await clearCart();
      
      if (result.success) {
        setMessage('Cart cleared successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const { subtotal, originalTotal, savings, shipping, total, itemCount } = getCartTotals();

  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercentage = Math.min(100, ((freeShippingThreshold - remainingForFreeShipping) / freeShippingThreshold) * 100);

  return (
    <div className="cart">
      <div className="container">
        {}
        <div className="page-header">
          <Link to="/products" className="back-btn">
            <FiArrowLeft />
            Continue Shopping
          </Link>
          <h1>Shopping Cart</h1>
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>

        {loading && (
          <div className="loading">
            <p>Loading cart...</p>
          </div>
        )}

        {!loading && cartItems.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingBag className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : !loading && (
          <div className="cart-modal">
            {}
            <div className="cart-header">
              <div className="cart-title">
                <h2>Shopping Cart</h2>
                <span className="item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              </div>
              <button className="close-cart">
                <FiX />
              </button>
            </div>

            {}
            {remainingForFreeShipping > 0 && (
              <div className="free-shipping-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  <FiTruck className="truck-icon" />
                </div>
                <p className="progress-text">
                  Only ₹{remainingForFreeShipping.toLocaleString()} away from Free Shipping
                </p>
              </div>
            )}

            {}
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : process.env.PUBLIC_URL + '/logos/logo.jpg'} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">₹{item.price.toLocaleString()}</p>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        disabled={loading}
                      >
                        <FiMinus />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        disabled={loading}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loading}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            {}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {}
            <div className="cart-actions">
              <Link 
                to={user ? "/checkout" : "/login"} 
                className="checkout-btn"
                state={{ from: '/cart' }}
              >
                {user ? "CHECKOUT" : "LOGIN TO CHECKOUT"}
              </Link>
              <Link to="/products" className="view-cart-btn">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

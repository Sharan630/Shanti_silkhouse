import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTruck } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, loading, updateQuantity, removeFromCart, getCartTotals } = useCart();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdateQuantity = async (cartItemId, change) => {
    const item = cartItems.find(item => item.id === cartItemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    const result = await updateQuantity(cartItemId, newQuantity);
    
    if (result.success) {
      setMessage('Cart updated successfully');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    const result = await removeFromCart(cartItemId);
    
    if (result.success) {
      setMessage('Item removed from cart');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const { subtotal, shipping, total, itemCount } = getCartTotals();
  const freeShippingThreshold = 5000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose}></div>
      
      {/* Cart Sidebar */}
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-sidebar-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {subtotal > 0 && subtotal < freeShippingThreshold && (
          <div className="free-shipping-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">
              Only ₹{amountToFreeShipping.toLocaleString()} away from Free Shipping
              <FiTruck className="truck-icon" />
            </p>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`cart-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Cart Items */}
        <div className="cart-items-container">
          {!user ? (
            <div className="cart-login-prompt">
              <p>Please login to view your cart</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
              >
                Login
              </button>
            </div>
          ) : loading ? (
            <div className="cart-loading">
              <p>Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <Link to="/products" className="btn-secondary" onClick={onClose}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : '/logos/logo.jpg'} 
                      alt={item.name} 
                    />
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <div className="item-options">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        disabled={loading}
                      >
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        disabled={loading}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    
                    <button 
                      className="remove-item"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={loading}
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {user && cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {user && cartItems.length > 0 && (
          <div className="cart-actions">
            <Link to="/checkout" className="btn-primary checkout-btn" onClick={onClose}>
              CHECKOUT
            </Link>
            <Link to="/cart" className="btn-secondary view-cart-btn" onClick={onClose}>
              VIEW CART
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

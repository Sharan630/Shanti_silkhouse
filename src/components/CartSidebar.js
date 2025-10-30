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
      {}
      <div className="cart-overlay" onClick={onClose}></div>
      
      {}
      <div className="cart-sidebar">
        {}
        <div className="cart-sidebar-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {}
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

        {}
        {message && (
          <div className={`cart-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {}
        <div className="cart-items-container">
          {loading ? (
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
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761813953/Screenshot_2025-10-30_141450_dkxgox.png'} 
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

        {}
        {cartItems.length > 0 && (
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

        {}
        {cartItems.length > 0 && (
          <div className="cart-actions">
            <Link 
              to={user ? "/checkout" : "/login"} 
              className="btn-primary checkout-btn" 
              onClick={onClose}
              state={{ from: '/cart' }}
            >
              {user ? "CHECKOUT" : "LOGIN TO CHECKOUT"}
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

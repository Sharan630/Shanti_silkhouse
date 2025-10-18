import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
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

  if (!user) {
    return (
      <div className="cart">
        <div className="container">
          <div className="empty-cart">
            <FiShoppingBag className="empty-icon" />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your cart.</p>
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <Link to="/products" className="back-btn">
            <FiArrowLeft />
            Continue Shopping
          </Link>
          <h1>Shopping Cart</h1>
          <p>{itemCount} item(s) in your cart</p>
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
          <div className="cart-content">
            {/* Cart Items Table */}
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>Cart Items</h2>
                <button className="clear-cart" onClick={handleClearCart}>
                  Clear All
                </button>
              </div>
              
              <div className="cart-table-container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="cart-item-row">
                        <td className="product-cell">
                          <div className="product-info">
                            <div className="item-image">
                              <img 
                                src={item.images && item.images.length > 0 ? item.images[0] : '/logos/logo.jpg'} 
                                alt={item.name} 
                              />
                            </div>
                            <div className="item-details">
                              <h3>{item.name}</h3>
                              <div className="item-options">
                                {item.color && <span className="option">Color: {item.color}</span>}
                                {item.size && <span className="option">Size: {item.size}</span>}
                                {item.material && <span className="option">Material: {item.material}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="price-cell">
                          <div className="item-price">
                            <span className="current-price">₹{item.price.toLocaleString()}</span>
                            <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="quantity-cell">
                          <div className="item-quantity">
                            <button 
                              type="button" 
                              aria-label={`Decrease quantity of ${item.name}`} 
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              disabled={loading}
                            >
                              <FiMinus />
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                              type="button" 
                              aria-label={`Increase quantity of ${item.name}`} 
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              disabled={loading}
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </td>
                        <td className="total-cell">
                          <span className="total-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </td>
                        <td className="action-cell">
                          <button 
                            className="remove-btn"
                            type="button"
                            aria-label={`Remove ${item.name} from cart`}
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Original Price</span>
                  <span>₹{originalTotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row savings">
                  <span>You Save</span>
                  <span>₹{savings.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="free-shipping">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-actions">
                <Link to="/checkout" className="btn-primary checkout-btn">
                  Proceed to Checkout
                </Link>
                <Link to="/products" className="btn-secondary">
                  Continue Shopping
                </Link>
              </div>

              <div className="summary-features">
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <div>
                    <h4>Free Shipping</h4>
                    <p>On orders above ₹5000</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <div>
                    <h4>Secure Payment</h4>
                    <p>100% secure transactions</p>
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
        )}

        {/* Recommended Products */}
        {!loading && cartItems.length > 0 && (
          <div className="recommended-products">
            <h2>You Might Also Like</h2>
            <div className="recommended-grid">
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=250&h=300&fit=crop" alt="Recommended" />
                <h4>Bridal Collection</h4>
                <p>₹45,000</p>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=250&h=300&fit=crop" alt="Recommended" />
                <h4>Traditional Silk</h4>
                <p>₹32,000</p>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1571513722275-4b8b2b8b2b8b?w=250&h=300&fit=crop" alt="Recommended" />
                <h4>Modern Designer</h4>
                <p>₹22,000</p>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

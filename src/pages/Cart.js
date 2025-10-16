import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Royal Silk Saree",
      price: 25000,
      originalPrice: 30000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      color: "Red",
      size: "Free Size",
      quantity: 1
    },
    {
      id: 2,
      name: "Designer Cotton Saree",
      price: 12000,
      originalPrice: 15000,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=400&fit=crop",
      color: "Blue",
      size: "Free Size",
      quantity: 2
    },
    {
      id: 3,
      name: "Party Wear Saree",
      price: 18000,
      originalPrice: 22000,
      image: "https://images.unsplash.com/photo-1571513722275-4b8b2b8b2b8b?w=300&h=400&fit=crop",
      color: "Black",
      size: "Free Size",
      quantity: 1
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal + shipping;

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
          <p>{cartItems.length} item(s) in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingBag className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>Cart Items</h2>
                <button className="clear-cart">Clear All</button>
              </div>
              
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-options">
                        <span className="option">Color: {item.color}</span>
                        <span className="option">Size: {item.size}</span>
                      </div>
                      <div className="item-price">
                        <span className="current-price">₹{item.price.toLocaleString()}</span>
                        <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="item-quantity">
                      <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQuantity(item.id, -1)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQuantity(item.id, 1)}>
                        <FiPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      <span className="total-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="remove-btn"
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => removeItem(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
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
        {cartItems.length > 0 && (
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

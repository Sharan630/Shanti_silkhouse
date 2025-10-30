import React from 'react';
import { FiX, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './WishlistSidebar.css';

const WishlistSidebar = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, 1, null, null, product);
    if (result.success) {
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  return (
    <div className={`wishlist-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="wishlist-overlay" onClick={onClose}></div>
      <div className="wishlist-content">
        <div className="wishlist-header">
          <h2>Your wishlist</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <FiHeart className="empty-icon" />
            <h3>Your wishlist is empty</h3>
            <p>Add some beautiful sarees to your wishlist!</p>
          </div>
        ) : (
          <>
            <div className="wishlist-actions">
              <button className="clear-btn" onClick={handleClearWishlist}>
                Clear All
              </button>
            </div>

            <div className="wishlist-items">
              {wishlist.map((product) => (
                <div key={product.id} className="wishlist-item">
                  <div className="item-image">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761813953/Screenshot_2025-10-30_141450_dkxgox.png'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761813953/Screenshot_2025-10-30_141450_dkxgox.png';
                      }}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{product.name}</h4>
                    <p className="item-description">{product.description}</p>
                    <div className="item-price">₹{parseFloat(product.price).toLocaleString()}</div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      title="Remove from wishlist"
                    >
                      <FiHeart />
                    </button>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;

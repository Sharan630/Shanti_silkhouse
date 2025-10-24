import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiHeart } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleOpenCartSidebar = () => {
      setShowCart(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('openCartSidebar', handleOpenCartSidebar);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openCartSidebar', handleOpenCartSidebar);
    };
  }, []); 

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-container">
              <img 
                src="/logos/logo.png" 
                alt="Shanti Silk House Logo" 
                className="logo-img"
                loading="eager"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="logo-text" style={{display: 'none'}}>
                <div className="lotus-icon">🌸</div>
                <div className="logo-text-content">
                  <div className="logo-main">SHANTI</div>
                  <div className="logo-sub">
                    <span className="line"></span>
                    <span className="text">SILK HOUSE</span>
                    <span className="line"></span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/collection/silk-sarees" className="nav-link">SILK SAREES</Link>
            <Link to="/collection/banarasi-sarees" className="nav-link">BANARASI SAREES</Link>
            <Link to="/collection/designer-sarees" className="nav-link">DESIGNER SAREES</Link>
            <Link to="/collection/bridal-sarees" className="nav-link">BRIDAL SAREES</Link>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Search sarees..." />
              <FiSearch className="search-icon" />
            </div>
            {user ? (
              <div className="user-menu">
                <span className="user-name">Hi, {user.firstName}</span>
                <button onClick={logout} className="action-btn logout-btn">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <button 
                className="action-btn"
                onClick={() => navigate('/login')}
              >
                <FiUser />
              </button>
            )}
            <button 
              className="action-btn wishlist-btn"
              onClick={() => setShowWishlist(true)}
            >
              <FiHeart />
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </button>
            <button 
              className="action-btn cart-btn"
              onClick={() => setShowCart(true)}
            >
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
      
      {/* Wishlist Sidebar */}
      <WishlistSidebar 
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
      />
    </header>
  );
};

export default Header;

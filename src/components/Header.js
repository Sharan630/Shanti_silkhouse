import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartSidebar from './CartSidebar';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
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
                src="/logos/logo.jpg" 
                alt="Shanti Silk House Logo" 
                className="logo-img"
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
            <Link to="/products?category=kanjivaram" className="nav-link">KANJIVARAMS</Link>
            <Link to="/products?category=vintage" className="nav-link">SHANTI VINTAGE</Link>
            <Link to="/products?category=crafts" className="nav-link">CRAFTS</Link>
            <Link to="/products?category=fancy" className="nav-link">FANCY & OCCASIONAL</Link>
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
    </header>
  );
};

export default Header;

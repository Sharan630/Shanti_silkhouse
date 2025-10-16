import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount] = useState(3); // This would come from context/state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); 

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-container">
              <div className="lotus-icon">🌸</div>
              <div className="logo-text">
                <div className="logo-main">SHANTI</div>
                <div className="logo-sub">
                  <span className="line"></span>
                  <span className="text">SILK HOUSE</span>
                  <span className="line"></span>
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
                onClick={() => setShowLogin(true)}
              >
                <FiUser />
              </button>
            )}
            <Link to="/cart" className="action-btn cart-btn">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          showRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      
      {/* Register Modal */}
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          showLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </header>
  );
};

export default Header;

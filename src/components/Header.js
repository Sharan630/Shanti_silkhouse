import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiLogOut, FiHeart, FiMenu } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim().toLowerCase();
      
      if (searchTerm.includes('silk') || searchTerm.includes('silk saree') || searchTerm.includes('pure silk')) {
        navigate('/collection/silk-sarees');
      } else if (searchTerm.includes('banarasi') || searchTerm.includes('banarsi') || searchTerm.includes('banaras')) {
        navigate('/collection/banarasi-sarees');
      } else if (searchTerm.includes('designer') || searchTerm.includes('design') || searchTerm.includes('fashion')) {
        navigate('/collection/designer-sarees');
      } else if (searchTerm.includes('bridal') || searchTerm.includes('wedding') || searchTerm.includes('bride') || searchTerm.includes('marriage')) {
        navigate('/collection/bridal-sarees');
      } else if (searchTerm.includes('cotton') || searchTerm.includes('cotton saree')) {
        navigate('/collection/silk-sarees'); // Default to silk for cotton searches
      } else if (searchTerm.includes('georgette') || searchTerm.includes('chiffon')) {
        navigate('/collection/designer-sarees');
      } else {
        
        navigate('/collection/silk-sarees');
      }
      
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(prev => !prev);
  }, []); 

  return (
    <>
      {}
      <header className="header desktop-header">
      <div className="header-content">
          {}
        <Link to="/" className="logo">
          <img 
            src="https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761476953/Screenshot_2025-10-26_163521_xzl1r4.svg" 
            alt="Shanti Silk House Logo" 
            className="logo-img"
            loading="eager"
            style={{display: 'block', minWidth: '100px', minHeight: '40px'}}
            onLoad={() => console.log('Desktop logo loaded successfully')}
            onError={(e) => {
              console.log('Cloudinary SVG logo failed to load');
              e.target.style.display = 'none';
            }}
          />
        </Link>

          {}
        <nav className="desktop-nav">
          <Link to="/collection/silk-sarees" className="nav-link">SILK SAREES</Link>
          <Link to="/collection/banarasi-sarees" className="nav-link">BANARASI SAREES</Link>
          <Link to="/collection/designer-sarees" className="nav-link">DESIGNER SAREES</Link>
          <Link to="/collection/bridal-sarees" className="nav-link">BRIDAL SAREES</Link>
        </nav>

          {}
        <div className="header-actions">
          <form className="search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search sarees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-submit">
              <FiSearch className="search-icon" />
            </button>
          </form>
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
        </div>
      </div>
      </header>

      {}
      <header className="mobile-header">
        <div className="mobile-header-top">
          {}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
          >
            <div className={`hamburger ${showMobileMenu ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {}
          <Link to="/" className="mobile-logo">
            <img 
              src="https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761476953/Screenshot_2025-10-26_163521_xzl1r4.svg" 
              alt="Shanti Silk House Logo" 
              className="mobile-logo-img"
              loading="eager"
              onLoad={() => console.log('Mobile logo loaded successfully')}
              onError={(e) => {
                console.log('Cloudinary SVG logo failed to load');
                e.target.style.display = 'none';
              }}
            />
          </Link>

          {}
          <div className="mobile-actions">
            <button 
              className="mobile-action-btn search-btn"
              onClick={() => {
                const searchInput = document.querySelector('.mobile-search-input');
                if (searchInput) {
                  searchInput.focus();
                }
              }}
            >
              <FiSearch />
            </button>
            <button 
              className="mobile-action-btn wishlist-btn"
              onClick={() => setShowWishlist(true)}
            >
              <FiHeart />
              {wishlistCount > 0 && <span className="mobile-count">{wishlistCount}</span>}
            </button>
            <button 
              className="mobile-action-btn cart-btn"
              onClick={() => setShowCart(true)}
            >
              <FiShoppingCart />
              {cartCount > 0 && <span className="mobile-count">{cartCount}</span>}
            </button>
          </div>
        </div>

        {}
        <div className="mobile-search-section">
          <form className="mobile-search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search sarees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn">
              <FiSearch />
            </button>
          </form>
        </div>

        {}
        <div className={`mobile-nav-overlay ${showMobileMenu ? 'active' : ''}`}>
          <nav className="mobile-nav">
            <div className="mobile-nav-header">
              <h3>Collections</h3>
              <button 
                className="mobile-nav-close"
                onClick={() => setShowMobileMenu(false)}
              >
                ×
              </button>
            </div>
            
            <div className="mobile-nav-links">
              <Link 
                to="/collection/silk-sarees" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="nav-link-content">
                  <div className="nav-icon silk-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="nav-text">
                    <span className="nav-title">Silk Sarees</span>
                    <span className="nav-subtitle">Premium silk collection</span>
                  </div>
                </div>
                <div className="nav-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
              
              <Link 
                to="/collection/banarasi-sarees" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="nav-link-content">
                  <div className="nav-icon banarasi-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                      <circle cx="12" cy="12" r="2"/>
                    </svg>
                  </div>
                  <div className="nav-text">
                    <span className="nav-title">Banarasi Sarees</span>
                    <span className="nav-subtitle">Traditional handwoven</span>
                  </div>
                </div>
                <div className="nav-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
              
              <Link 
                to="/collection/designer-sarees" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="nav-link-content">
                  <div className="nav-icon designer-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="nav-text">
                    <span className="nav-title">Designer Sarees</span>
                    <span className="nav-subtitle">Contemporary designs</span>
                  </div>
                </div>
                <div className="nav-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
              
              <Link 
                to="/collection/bridal-sarees" 
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="nav-link-content">
                  <div className="nav-icon bridal-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div className="nav-text">
                    <span className="nav-title">Bridal Sarees</span>
                    <span className="nav-subtitle">Wedding collection</span>
                  </div>
                </div>
                <div className="nav-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
            </div>

            {}
            <div className="mobile-nav-footer">
              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <span className="mobile-user-greeting">Welcome back!</span>
                    <span className="mobile-user-name">{user.firstName}</span>
                  </div>
                  <button onClick={logout} className="mobile-logout-btn">
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-section">
                  <button 
                    className="mobile-login-btn"
                    onClick={() => {
                      navigate('/login');
                      setShowMobileMenu(false);
                    }}
                  >
                    <FiUser />
                    Login / Register
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {}
      <CartSidebar 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
      
      {}
      <WishlistSidebar 
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
      />
    </>
  );
};

export default Header;

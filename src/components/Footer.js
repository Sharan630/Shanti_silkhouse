import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {}
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761342080/logo_fmeydv.svg" 
                alt="Shanti Silk House Logo" 
                className="footer-logo-img"
                loading="eager"
                onError={(e) => {
                  console.log('Cloudinary SVG logo failed to load');
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="footer-description">
              Discover the finest collection of traditional and contemporary sarees. 
              Each piece is carefully curated to bring you elegance and style.
            </p>
            <div className="social-links">
              <a href="https://facebook.com/shantisilks" target="_blank" rel="noopener noreferrer" className="social-link">
                <FiFacebook />
              </a>
              <a href="https://instagram.com/shantisilks" target="_blank" rel="noopener noreferrer" className="social-link">
                <FiInstagram />
              </a>
              <a href="https://twitter.com/shantisilks" target="_blank" rel="noopener noreferrer" className="social-link">
                <FiTwitter />
              </a>
            </div>
          </div>

          {}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><Link to="/collection/silk-sarees">Collection</Link></li>
              <li><a href="/#about">About Shanti Silks</a></li>
              <li><a href="/#about">Contact</a></li>
            </ul>
          </div>

          {}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/collection/silk-sarees">Silk Sarees</Link></li>
              <li><Link to="/collection/banarasi-sarees">Banarasi Sarees</Link></li>
              <li><Link to="/collection/designer-sarees">Designer Sarees</Link></li>
              <li><Link to="/collection/bridal-sarees">Bridal Sarees</Link></li>
              <li><Link to="/collection/party-wear">Party Wear</Link></li>
            </ul>
          </div>

          {}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiMapPin />
                <span>3H5Q+X3C, 1st Main Rd, CQAL Layout, Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+91 95911 28327</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>info@shantisilks.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Shanti Silk House. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/#about">Privacy Policy</a>
              <a href="/#about">Terms of Service</a>
              <a href="/#about">Shipping Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

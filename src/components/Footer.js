import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <h3>Shanti Silk House</h3>
              <p>Premium Collection</p>
            </div>
            <p className="footer-description">
              Discover the finest collection of traditional and contemporary sarees. 
              Each piece is carefully curated to bring you elegance and style.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FiFacebook />
              </a>
              <a href="#" className="social-link">
                <FiInstagram />
              </a>
              <a href="#" className="social-link">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Collection</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=silk">Silk Sarees</Link></li>
              <li><Link to="/products?category=cotton">Cotton Sarees</Link></li>
              <li><Link to="/products?category=designer">Designer Sarees</Link></li>
              <li><Link to="/products?category=bridal">Bridal Sarees</Link></li>
              <li><Link to="/products?category=party">Party Wear</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiMapPin />
                <span>123 Fashion Street, Mumbai, India</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>info@elegantsarees.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Shanti Silk House. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/shipping">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiStar, FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const { addToCart } = useCart();
  const { admin } = useAuth();
  const [message, setMessage] = useState('');

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1, null, null, product);
    
    if (result.success) {
      setMessage('Item added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
      window.dispatchEvent(new CustomEvent('openCartSidebar'));
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/admin/products/${productId}`);
        setMessage('Product deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        window.location.reload();
      } catch (error) {
        setMessage('Error deleting product');
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const products = [
    {
      id: 1,
      name: "Royal Silk Saree",
      price: 25000,
      originalPrice: 30000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
      category: "silk",
      rating: 4.8,
      reviews: 124,
      colors: ["Red", "Gold", "Maroon"],
      sizes: ["Free Size"]
    },
    {
      id: 2,
      name: "Designer Cotton Saree",
      price: 12000,
      originalPrice: 15000,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=600&fit=crop",
      category: "cotton",
      rating: 4.9,
      reviews: 89,
      colors: ["Blue", "Green", "Pink"],
      sizes: ["Free Size"]
    },
    {
      id: 3,
      name: "Bridal Collection",
      price: 45000,
      originalPrice: 55000,
      image: "https://images.unsplash.com/photo-1571513722275-4b8b2b8b2b8b?w=400&h=600&fit=crop",
      category: "bridal",
      rating: 4.7,
      reviews: 156,
      colors: ["Red", "Gold"],
      sizes: ["Free Size"]
    },
    {
      id: 4,
      name: "Party Wear Saree",
      price: 18000,
      originalPrice: 22000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
      category: "party",
      rating: 4.6,
      reviews: 78,
      colors: ["Black", "Navy", "Purple"],
      sizes: ["Free Size"]
    },
    {
      id: 5,
      name: "Traditional Silk",
      price: 32000,
      originalPrice: 38000,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=600&fit=crop",
      category: "silk",
      rating: 4.8,
      reviews: 92,
      colors: ["Orange", "Yellow", "Green"],
      sizes: ["Free Size"]
    },
    {
      id: 6,
      name: "Modern Designer",
      price: 22000,
      originalPrice: 28000,
      image: "https://images.unsplash.com/photo-1571513722275-4b8b2b8b2b8b?w=400&h=600&fit=crop",
      category: "designer",
      rating: 4.5,
      reviews: 67,
      colors: ["White", "Cream", "Beige"],
      sizes: ["Free Size"]
    }
  ];

  const categories = [
    { name: "All", value: "all" },
    { name: "Silk Sarees", value: "silk" },
    { name: "Banarasi Sarees", value: "banarasi" },
    { name: "Designer Sarees", value: "designer" },
    { name: "Bridal Sarees", value: "bridal" },
    { name: "Party Wear", value: "party" }
  ];

  return (
    <div className="product-list">
      {}
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="container">
        {}
        <div className="page-header">
          <h1>Our Collection</h1>
          <p>Discover our exquisite range of traditional and contemporary sarees</p>
        </div>

        <div className="product-list-content">
          {}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category.value} className="filter-option">
                    <input type="radio" name="category" value={category.value} />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <div className="price-display">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Colors</h3>
              <div className="color-options">
                {["Red", "Blue", "Green", "Gold", "Black", "White", "Pink", "Purple"].map(color => (
                  <div key={color} className="color-option" style={{ backgroundColor: color.toLowerCase() }}>
                    <span>{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {}
          <main className="products-main">
            {}
            <div className="products-toolbar">
              <div className="toolbar-left">
                <span className="results-count">Showing {products.length} products</span>
              </div>
              <div className="toolbar-right">
                <div className="sort-options">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
                <div className="view-options">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    type="button"
                    aria-label="List view"
                    onClick={() => setViewMode('list')}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {}
            <div className={`products-container ${viewMode}`}>
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-actions">
                      <a
                        className="action-btn whatsapp"
                        href={`https://wa.me/919591128327?text=${encodeURIComponent(`Hi! I am interested in ${product?.name || 'this saree'} priced at Rs ${product?.price?.toLocaleString() || 'N/A'}. Here is the saree image: ${product?.image || (product.images && product.images[0])}. View product: https://www.shantisilkhouse.com/products/${product.id} Please provide more details.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Chat on WhatsApp"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                      <button className="action-btn wishlist" type="button" aria-label="Add to wishlist">
                        <FiHeart />
                      </button>
                      <button 
                        className="action-btn cart" 
                        type="button" 
                        aria-label="Add to cart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FiShoppingCart />
                      </button>
                      {admin && (
                        <button 
                          className="action-btn delete" 
                          type="button" 
                          aria-label="Delete product"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete product (Admin only)"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                    <div className="product-badge">
                      <span>Sale</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < Math.floor(product.rating) ? 'filled' : ''} />
                        ))}
                      </div>
                      <span>({product.reviews})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{product.price.toLocaleString()}</span>
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="product-colors">
                      {product.colors.map(color => (
                        <span key={color} className="color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                      ))}
                    </div>
                    <Link to={`/product/${product.id}`} className="view-product-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="pagination">
              <button className="page-btn">Previous</button>
              <div className="page-numbers">
                <button className="page-number active">1</button>
                <button className="page-number">2</button>
                <button className="page-number">3</button>
                <span>...</span>
                <button className="page-number">10</button>
              </div>
              <button className="page-btn">Next</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

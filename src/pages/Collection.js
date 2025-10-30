import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FiHeart, FiFilter, 
  FiChevronDown, FiShare2, FiArrowUp,
  FiVideo, FiPhone, FiMessageCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import ImageCarousel from '../components/ImageCarousel';
import axios from 'axios';
import './Collection.css';

const Collection = () => {
  const { collectionName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [priceRange, setPriceRange] = useState([0, 319999]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    availability: [],
    blouse: []
  });
  const [isBlouseExpanded, setIsBlouseExpanded] = useState(false);
  
  const { addToCart, buyNow } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.add('has-fixed-sidebar');
    return () => {
      document.body.classList.remove('has-fixed-sidebar');
    };
  }, []);

  const applyPriceFilter = () => {
    const filtered = products.filter(product => {
      const price = product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setFilteredProducts(filtered);
    console.log(`Filtered ${filtered.length} products within price range ₹${priceRange[0]} - ₹${priceRange[1]}`);
  };

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const getCategoryFromCollection = (collectionName) => {
    const categoryMap = {
      'silk-sarees': 'silk-sarees',
      'banarasi-sarees': 'banarasi-sarees', 
      'designer-sarees': 'designer-sarees',
      'bridal-sarees': 'bridal-sarees'
    };
    return categoryMap[collectionName] || collectionName;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const category = getCategoryFromCollection(collectionName);
        const response = await axios.get(`/api/products?category=${category}&limit=1000`);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [collectionName]);
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
  const handleBuyNow = async (product) => {
    if (!user) {
      setMessage('Please login to proceed with checkout');
      setTimeout(() => setMessage(''), 3000);
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    const result = await buyNow(product.id, 1, null, null, product);
    
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        setMessage('');
        navigate(result.redirectTo);
      }, 1500);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const getCollectionTitle = (category) => {
    const titles = {
      'silk-sarees': 'Silk Sarees',
      'banarasi-sarees': 'Banarasi Sarees', 
      'designer-sarees': 'Designer Sarees',
      'bridal-sarees': 'Bridal Sarees'
    };
    return titles[category] || 'Collection';
  };

  const blouseOptions = [
    "Ash", "Blue", "Bottle Green", 
    "Brick", "Brown", "Burgundy", 
    "Dark-Blue", "Gold Zari", "Green"
  ];
  return (
    <div className="collection-page">
      <div className="collection-content">
        {}
        <aside className="collection-sidebar">
          <div className="filter-section">
            <h3>Availability</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.availability.includes('in-stock')}
                  onChange={() => handleFilterChange('availability', 'in-stock')}
                />
                <span>In Stock</span>
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.availability.includes('out-of-stock')}
                  onChange={() => handleFilterChange('availability', 'out-of-stock')}
                />
                <span>Out Of Stock</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-header">
              <h3>Price</h3>
              <span className="collapse-icon">—</span>
            </div>
            <div className="price-filter">
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max="319999"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="range-slider"
                />
                <div className="range-track"></div>
              </div>
              <div className="price-inputs">
                <div className="price-input">
                  <span className="currency">₹</span>
                  <input 
                    type="number" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  />
                </div>
                <span className="price-separator">to</span>
                <div className="price-input">
                  <span className="currency">₹</span>
                  <input 
                    type="number" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  />
                </div>
              </div>
              <button 
                className="apply-btn"
                onClick={applyPriceFilter}
              >
                APPLY
              </button>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-header" onClick={() => setIsBlouseExpanded(!isBlouseExpanded)}>
              <h3>Blouse</h3>
              <span className="collapse-icon">{isBlouseExpanded ? '—' : '+'}</span>
            </div>
            <div className={`blouse-options-container ${isBlouseExpanded ? 'expanded' : ''}`}>
              <div className="filter-options">
                {blouseOptions.map((option, index) => (
                  <label key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedFilters.blouse.includes(option)}
                      onChange={() => handleFilterChange('blouse', option)}
                    />
                    <span>
                      {option} (Unstitched)
                    </span>
                  </label>
                ))}
              </div>
              <div className="currency-selector">
                <select className="currency-dropdown">
                  <option value="INR">🇮🇳 INR</option>
                </select>
              </div>
              <div className="show-all-link">
                <a href="#" className="show-all">Show all</a>
              </div>
            </div>
          </div>
        </aside>

        {}
        <main className="collection-main">
          <div className="collection-header-section">
            <h1 className="collection-title">{getCollectionTitle(collectionName)}</h1>
            
            <div className="collection-controls">

              <div className="sort-controls">
                <div className="control-group">
                  <span className="control-label">ITEMS PER PAGE</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    className="control-select"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="control-group">
                  <span className="control-label">SORT BY</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="control-select"
                  >
                    <option value="alphabetical">Alphabetical</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="products-grid">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>No sarees available in this category yet.</p>
                <p>Check back later or browse other categories.</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <ImageCarousel 
                      images={product.images && product.images.length > 0 ? product.images : ['https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761476953/Screenshot_2025-10-26_163521_xzl1r4.svg']}
                      autoPlay={true}
                      interval={2000}
                      showThumbnails={false}
                      showControls={false}
                      className="product-card-carousel"
                    />
                  </div>
                  <div className="product-info">
                    <div className="product-pricing-section">
                      <div className="product-prices">
                        {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) ? (
                          <>
                            <div className="original-price">₹{parseFloat(product.originalPrice).toLocaleString()}</div>
                            <div className="discounted-price">₹{parseFloat(product.price).toLocaleString()}</div>
                          </>
                        ) : (
                          <div className="product-price">₹{parseFloat(product.price).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                    <div className="product-title">{product.name || 'Silk Saree'}</div>
                    <div className="product-description">{product.description || 'Pure Silk Saree'}</div>
                    <div className="product-actions-right">
                      <a
                        className="icon-btn whatsapp"
                        href={`https://wa.me/919591128327?text=${encodeURIComponent(`Hi! I am interested in ${product?.name || 'this saree'} priced at Rs ${product?.price ? parseFloat(product.price).toLocaleString() : 'N/A'}. Here is the saree image: ${(product.image || (product.images && product.images[0]))}. View product: https://www.shantisilkhouse.com/products/${product.id} Please provide more details.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Chat on WhatsApp"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                      <button 
                        type="button" 
                        className={`icon-btn like ${isInWishlist(product.id) ? 'liked' : ''}`}
                        onClick={() => toggleWishlist(product)}
                        aria-label="Add to wishlist" 
                        title="Add to wishlist"
                      >
                        <FiHeart />
                      </button>
                    </div>
                    {product.stock_quantity === 0 ? (
                      <button className="add-to-cart-btn out-of-stock" disabled>
                        OUT OF STOCK
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        ADD TO CART
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {}
      <div className="floating-actions">
        <button className="floating-btn share-btn">
          <FiShare2 />
        </button>
        <button className="floating-btn scroll-btn">
          <FiArrowUp />
        </button>
        <div className="floating-group">
          <button className="floating-btn video-btn">
            <FiVideo />
          </button>
          <button className="floating-btn whatsapp-btn">
            <FaWhatsapp />
          </button>
          <button className="floating-btn phone-btn">
            <FiPhone />
          </button>
        </div>
      </div>

      {}
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Collection;
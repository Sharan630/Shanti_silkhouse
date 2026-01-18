import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus, FiShare2, FiVideo } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ImageCarousel from '../components/ImageCarousel';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('Red');
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customStitching, setCustomStitching] = useState(false);
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Scroll to top when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/products/${id}`);
        
        const data = response.data;
        const productData = data.product;
        
        if (!productData) {
          setError('Product data not available');
          setLoading(false);
          return;
        }
        
        // Helper function to parse JSON strings or return arrays/values
        const parseField = (field) => {
          if (!field) return null;
          if (typeof field === 'string') {
            try {
              const parsed = JSON.parse(field);
              return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
            } catch (e) {
              return field;
            }
          }
          if (Array.isArray(field) && field.length > 0) {
            return field;
          }
          return null;
        };
        
        // Handle images - check multiple sources
        let productImages = [];
        const parsedImages = parseField(productData.images);
        if (parsedImages) {
          productImages = Array.isArray(parsedImages) ? parsedImages : [parsedImages];
        } else if (productData.image) {
          productImages = Array.isArray(productData.image) ? productData.image : [productData.image];
        }
        
        // Ensure we have at least one image
        if (productImages.length === 0) {
          productImages = ['https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761476953/Screenshot_2025-10-26_163521_xzl1r4.svg'];
        }
        
        // Handle colors
        const parsedColors = parseField(productData.colors);
        const productColors = parsedColors || ['Free Size'];
        
        // Handle sizes
        const parsedSizes = parseField(productData.sizes);
        const productSizes = parsedSizes || ['Free Size'];
        
        // Transform API data to match component structure
        const transformedProduct = {
          id: productData.id,
          name: productData.name || 'Product',
          price: parseFloat(productData.price) || 0,
          originalPrice: productData.original_price ? parseFloat(productData.original_price) : null,
          sku: productData.sku || `SKU${productData.id}`,
          rating: parseFloat(productData.rating) || 0,
          reviews: parseInt(productData.reviews) || 0,
          description: productData.description || '',
          stock_quantity: productData.stock_quantity !== null && productData.stock_quantity !== undefined 
            ? parseInt(productData.stock_quantity) 
            : 0, // Default to 0 (out of stock) if not set
          images: productImages,
          colors: productColors,
          sizes: productSizes,
          specifications: {
            "Fabric": productData.material || "Silk",
            "Work": productData.work || "Zari",
            "Occasion": productData.occasion || "Wedding, Party, Festive",
            "Care": productData.care_instructions || "Dry Clean Only",
            "Blouse": productData.blouse || "Included",
            "Length": productData.length || "5.5 meters"
          },
          features: parseField(productData.features) || []
        };
        
        setProduct(transformedProduct);
        
        // Set default selected color and size
        if (productColors.length > 0) {
          setSelectedColor(productColors[0]);
        }
        if (productSizes.length > 0) {
          setSelectedSize(productSizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        if (err.response) {
          // Server responded with error status
          if (err.response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product. Please try again.');
          }
        } else if (err.request) {
          // Request was made but no response received
          setError('Unable to connect to server. Please check your connection.');
        } else {
          // Something else happened
          setError('Failed to load product. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch related/random products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoadingRelated(true);
        const response = await axios.get(`/api/products?limit=20`);
        const allProducts = response.data.products || [];
        
        // Filter out current product and get random 4 products
        const filteredProducts = allProducts.filter(p => p.id.toString() !== id.toString());
        const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 4);
        
        // Transform products to match component structure
        const transformedProducts = randomProducts.map(p => ({
          id: p.id,
          name: p.name || 'Product',
          price: parseFloat(p.price) || 0,
          image: (p.images && typeof p.images === 'string' 
            ? (JSON.parse(p.images)[0] || p.image || '')
            : (Array.isArray(p.images) && p.images[0]) || p.image || ''),
          images: p.images && typeof p.images === 'string' 
            ? JSON.parse(p.images) 
            : (Array.isArray(p.images) ? p.images : [p.image || ''])
        }));
        
        setRelatedProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (id) {
      fetchRelatedProducts();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.stock_quantity === 0) {
      setMessage('Product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id, quantity, selectedSize, selectedColor, product);
      if (result.success) {
        setMessage('Product added to cart successfully!');
        setTimeout(() => setMessage(''), 3000);
        // Open cart sidebar
        window.dispatchEvent(new CustomEvent('openCartSidebar'));
      } else {
        setMessage(result.message || 'Failed to add to cart');
      }
    } catch (err) {
      setMessage('Error adding to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (product.stock_quantity === 0) {
      setMessage('Product is out of stock');
      return;
    }
    
    handleAddToCart();
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  const handleStockNotification = (e) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement stock notification API call
      setMessage('You will be notified when this product is back in stock!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="product-detail"><div className="container"><div className="loading">Loading product...</div></div></div>;
  }

  if (error && !product) {
    return <div className="product-detail"><div className="container"><div className="error">Error: {error}</div></div></div>;
  }

  if (!product) {
    return <div className="product-detail"><div className="container"><div className="error">Product not found</div></div></div>;
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Calculate stock status - check if product has stock
  const stockQty = product?.stock_quantity;
  // If stock_quantity is 0, null, undefined, or not a positive number, it's out of stock
  const isOutOfStock = !stockQty || parseInt(stockQty) <= 0;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/collection/silk-sarees">Collection</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-content">
          {}
          <div className="product-images">
            <ImageCarousel 
              images={product.images}
              autoPlay={true}
              interval={2000}
              showThumbnails={true}
              showControls={true}
              className="product-carousel"
            />
            {}
            <div className="currency-selector">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="currency-dropdown">
                <option value="INR">🇮🇳 INR</option>
                <option value="USD">🇺🇸 USD</option>
              </select>
            </div>
          </div>

          {}
          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
            </div>

            <div className="product-price">
              <span className="current-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="product-sku">
              <strong>SKU:</strong> {product.sku}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {}
            <div className="product-options">
              <div className="custom-stitching-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={customStitching}
                    onChange={(e) => setCustomStitching(e.target.checked)}
                  />
                  <span>Custom Stitching Services For Your Saree Close</span>
                </label>
              </div>

              <div className="quantity-selector-simple">
                <button type="button" aria-label="Decrease quantity" onClick={() => handleQuantityChange(-1)} className="qty-btn">
                  <FiMinus />
                </button>
                <span className="qty-value">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => handleQuantityChange(1)} className="qty-btn">
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Add to Cart Button - Right after quantity selector */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              {product.stock_quantity === 0 || product.stock_quantity === null || product.stock_quantity === undefined || !product.stock_quantity || parseInt(product.stock_quantity) <= 0 ? (
                <button 
                  type="button"
                  disabled={true}
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    padding: '15px 30px', 
                    background: '#9e9e9e', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    cursor: 'not-allowed'
                  }}
                >
                  SOLD OUT
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px', 
                    width: '100%', 
                    padding: '15px 30px', 
                    background: '#660000', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    cursor: isAddingToCart ? 'not-allowed' : 'pointer',
                    opacity: isAddingToCart ? 0.7 : 1
                  }}
                >
                  <FiShoppingCart />
                  {isAddingToCart ? 'Adding...' : 'ADD TO CART'}
                </button>
              )}
            </div>

            {}
            <div className="product-actions">
              {message && (
                <div className={`message ${message.includes('success') ? 'success' : message.includes('notified') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              
              <div className="action-buttons-row">
                <div className="action-icons-row">
                  <button className="action-icon wishlist" type="button" aria-label="Add to wishlist">
                    <FiHeart />
                  </button>
                  <button className="action-icon share" type="button" aria-label="Share product">
                    <FiShare2 />
                  </button>
                </div>
              </div>

              <button 
                className="btn-buy-now" 
                type="button" 
                aria-label="Buy now"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                style={{ width: '100%', padding: '15px 30px', marginTop: '10px', background: '#660000', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: '600', cursor: isOutOfStock ? 'not-allowed' : 'pointer', opacity: isOutOfStock ? 0.5 : 1 }}
              >
                BUY IT NOW
              </button>

              {}
              {isOutOfStock && (
                <div className="stock-notification">
                  <h4>Leave Your Email And We Will Notify As Soon As The Product/Variant Is Back In Stock</h4>
                  <form onSubmit={handleStockNotification} className="stock-notification-form">
                    <input
                      type="email"
                      placeholder="Insert your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="email-input"
                    />
                    <button type="submit" className="btn-subscribe">SUBSCRIBE</button>
                  </form>
                </div>
              )}

              {}
              <div className="additional-actions">
                <button className="btn-action-secondary" type="button">
                  View Similar
                </button>
                <button className="btn-action-secondary" type="button">
                  <FiVideo /> Video Call
                </button>
                <a
                  className="btn-action-secondary whatsapp-link"
                  href={`https://wa.me/919591128327?text=${encodeURIComponent(`${(product.images && product.images[selectedImage]) || product.images[0]}\n\nHi! I am interested in ${product?.name || 'this saree'} priced at Rs ${product?.price?.toLocaleString() || 'N/A'}.\nView product: ${window.location.href}\nPlease provide more details.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="product-tabs">
          <div className="tab-navigation">
            <button className="tab-btn active">Description</button>
            <button className="tab-btn">Specifications</button>
            <button className="tab-btn">Reviews</button>
            <button className="tab-btn">Shipping</button>
          </div>
          <div className="tab-content">
            <div className="tab-panel active">
              <h3>Product Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>
            <div className="tab-panel">
              <h3>Specifications</h3>
              <div className="specifications">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="related-products">
          <h2>You May Also Like</h2>
          {loadingRelated ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading related products...</div>
          ) : relatedProducts.length > 0 ? (
            <div className="related-grid">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="related-item" onClick={() => navigate(`/product/${relatedProduct.id}`)} style={{ cursor: 'pointer' }}>
                  <img 
                    src={relatedProduct.image || 'https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761476953/Screenshot_2025-10-26_163521_xzl1r4.svg'} 
                    alt={relatedProduct.name}
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/dbaiaiwkk/image/upload/v1761476953/Screenshot_2025-10-26_163521_xzl1r4.svg';
                    }}
                  />
                  <h4>{relatedProduct.name}</h4>
                  <p>₹{relatedProduct.price.toLocaleString()}</p>
                  <Link 
                    to={`/product/${relatedProduct.id}`} 
                    className="view-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No related products available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

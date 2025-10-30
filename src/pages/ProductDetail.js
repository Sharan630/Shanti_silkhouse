import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus, FiShare2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ImageCarousel from '../components/ImageCarousel';
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
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const product = {
    id: 1,
    name: "Royal Silk Saree",
    price: 25000,
    originalPrice: 30000,
    rating: 4.8,
    reviews: 124,
    description: "This exquisite royal silk saree is crafted from the finest mulberry silk, featuring intricate zari work and traditional motifs. Perfect for special occasions and celebrations.",
    features: [
      "100% Pure Mulberry Silk",
      "Handwoven Zari Work",
      "Traditional Motifs",
      "Pre-stitched Pleats",
      "Matching Blouse Piece"
    ],
    colors: ["Red", "Gold", "Maroon", "Navy"],
    sizes: ["Free Size"],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571513722275-4b8b2b8b2b8b?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop"
    ],
    specifications: {
      "Fabric": "Pure Mulberry Silk",
      "Work": "Zari Embroidery",
      "Occasion": "Wedding, Party, Festive",
      "Care": "Dry Clean Only",
      "Blouse": "Included",
      "Length": "5.5 meters"
    }
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Designer Cotton Saree",
      price: 12000,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Bridal Collection",
      price: 45000,
      image: "https://images.unsplash.com/photo-1571513722275-4b8b2b8b2b8b?w=300&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Party Wear Saree",
      price: 18000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop"
    }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="product-detail">
      <div className="container">
        {}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
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
            <div className="image-badge">
              <span>Premium Quality</span>
            </div>
          </div>

          {}
          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < Math.floor(product.rating) ? 'filled' : ''} />
                  ))}
                </div>
                <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">₹{product.price.toLocaleString()}</span>
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
              <span className="discount">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {}
            <div className="product-options">
              <div className="option-group">
                <h3>Color</h3>
                <div className="color-options">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      type="button"
                      aria-label={`Select color ${color}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              {}
              <div className="option-group">
                <h3>Size</h3>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      type="button"
                      aria-label={`Select size ${size}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {}
              <div className="option-group">
                <h3>Quantity</h3>
                <div className="quantity-selector">
                  <button type="button" aria-label="Decrease quantity" onClick={() => handleQuantityChange(-1)}>
                    <FiMinus />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => handleQuantityChange(1)}>
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            {}
            <div className="product-actions">
              {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              <div className="btn-container">
                <button 
                  className="btn-primary add-to-cart" 
                  type="button" 
                  aria-label="Add to cart"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <FiShoppingCart />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button className="btn-secondary buy-now" type="button" aria-label="Buy now">
                  Buy Now
                </button>
                <a
                  className="action-btn whatsapp"
                  href={`https://wa.me/919591128327?text=${encodeURIComponent(`Hi! I am interested in ${product?.name || 'this saree'} priced at Rs ${product?.price?.toLocaleString() || 'N/A'}. Here is the saree image: ${(product.images && product.images[selectedImage]) || product.images[0]}. Please provide more details.`)}`}
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
                <button className="action-btn share" type="button" aria-label="Share product">
                  <FiShare2 />
                </button>
              </div>
            </div>

            {}
            <div className="product-features">
              <h3>Key Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {}
            <div className="shipping-info">
              <div className="shipping-item">
                <FiTruck />
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders above ₹5000</p>
                </div>
              </div>
              <div className="shipping-item">
                <FiShield />
                <div>
                  <h4>Secure Payment</h4>
                  <p>100% secure transactions</p>
                </div>
              </div>
              <div className="shipping-item">
                <FiRefreshCw />
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
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
              <p>{product.description}</p>
              <p>This beautiful saree is perfect for weddings, festivals, and special occasions. The intricate work and premium quality make it a valuable addition to your wardrobe.</p>
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
          <div className="related-grid">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="related-item">
                <img src={relatedProduct.image} alt={relatedProduct.name} />
                <h4>{relatedProduct.name}</h4>
                <p>₹{relatedProduct.price.toLocaleString()}</p>
                <Link to={`/product/${relatedProduct.id}`} className="view-btn">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

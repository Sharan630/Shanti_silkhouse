import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiHeart, FiChevronLeft, FiChevronRight, FiShare2, FiArrowUp, FiVideo, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('20k');
  const { addToCart } = useCart();
  const [message, setMessage] = useState('');
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingArrivals, setLoadingArrivals] = useState(true);

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1, null, null, product);
    
    if (result.success) {
      setMessage('Item added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
      // Trigger cart sidebar to open
      window.dispatchEvent(new CustomEvent('openCartSidebar'));
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Fetch new arrivals from API
  const fetchNewArrivals = async () => {
    try {
      setLoadingArrivals(true);
      const response = await axios.get('/api/products/new-arrivals');
      setNewArrivals(response.data.products);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      setMessage('Error loading new arrivals');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoadingArrivals(false);
    }
  };

  const carouselSlides = [
    {
      id: 1,
      image: "https://cliosilks.com/cdn/shop/files/Untitled-1-2.jpg?v=1739348317&width=2400",
      position: "center center",
      title: "Premium Silk Collection",
      subtitle: "Handwoven with Love, Crafted for Royalty",
      badge: "New Arrival",
      description: "Discover our exquisite collection of handwoven silk sarees, each piece telling a story of tradition and elegance."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW4lMjBpbiUyMHNhcmVlfGVufDB8fDB8fHww",
      position: "center 35%",
      title: "Designer Sarees",
      subtitle: "Where Tradition Meets Modern Elegance",
      badge: "Best Seller",
      description: "Contemporary designs that celebrate the timeless beauty of Indian craftsmanship with a modern twist."
    },
    {
      id: 3,
      image: "https://zuanas.com/wp-content/uploads/2025/08/c-1-1024x682.jpg",
      position: "center center",
      title: "Bridal Collection",
      subtitle: "Make Your Special Day Unforgettable",
      badge: "Exclusive",
      description: "Stunning bridal sarees that will make you the center of attention on your most important day."
    },
    {
      id: 4,
      image: "https://img.freepik.com/premium-photo/elegant-fabric-with-floral-design-flowers-wooden-surface_653240-51568.jpg",
      position: "center center",
      title: "Traditional Weaves",
      subtitle: "Heritage Craftsmanship at its Finest",
      badge: "Heritage",
      description: "Authentic traditional weaves from master craftsmen, preserving centuries-old techniques."
    },
    {
      id: 5,
      image: "https://cliosilks.com/cdn/shop/files/Untitled-1-2.jpg?v=1739348317&width=2400",
      position: "center center",
      title: "Party Wear",
      subtitle: "Elegant Evening Ensembles",
      badge: "Trending",
      description: "Glamorous sarees perfect for special occasions and evening events."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Fetch new arrivals on component mount
  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === carouselSlides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1);
  };


  const showcaseSlides = [
    {
      id: 's1',
      image: 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW4lMjBpbiUyMHNhcmVlfGVufDB8fDB8fHww',
      title: 'KANJEEVARAM',
      tagline: 'From ₹32,999.00'
    },
    {
      id: 's2',
      image: 'https://t4.ftcdn.net/jpg/14/92/02/63/360_F_1492026312_spPMOxAHC3jvNvsF43OUPZDPNzLhsqIq.jpg',
      title: 'HANDLOOM CLASSICS',
      tagline: 'From ₹14,499.00'
    },
    {
      id: 's3',
      image: 'https://t4.ftcdn.net/jpg/09/72/20/43/360_F_972204343_qxjJTNMhsdMljBCkQpxLslJsklCIDaFy.jpg',
      title: 'BRIDAL EDIT',
      tagline: 'From ₹45,999.00'
    }
  ];

  const [showcaseIndex, setShowcaseIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % showcaseSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [showcaseSlides.length]);

  const giftProducts = [
    {
      id: 1,
      name: "Traditional Silk Saree",
      price: 22000,
      image: "https://mavuris.com/cdn/shop/articles/Red_Kanchipuram_Silk_Saree.png?v=1730986195"
    },
    {
      id: 2,
      name: "Designer Party Saree",
      price: 15000,
      image: "https://mavuris.com/cdn/shop/files/1000016656_2.jpg?v=1756219207"
    },
    {
      id: 3,
      name: "Bridal Collection Saree",
      price: 35000,
      image: "https://vivaahasilks.com/cdn/shop/products/DSC09212Kanchipuram_Bridal_Silk_Saree_Pure_Zari_2048x.webp?v=1739463895"
    },
    {
      id: 4,
      name: "Elegant Evening Saree",
      price: 19000,
      image: "https://brandmandir.com/media/catalog/product/cache/411a7c368a356a11933f7218f5d4cdaa/t/m/tmpTGC10378411_1_compressed.jpg"
    }
  ];


  return (
    <div className="home">
      {/* Message Display */}
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      {/* Side Utility Icons */}
      <div className="side-utilities">
        <button className="utility-btn" title="Share" type="button" aria-label="Share this page">
          <FiShare2 />
        </button>
        <button className="utility-btn" title="Scroll to Top" type="button" aria-label="Scroll to top">
          <FiArrowUp />
        </button>
        <button className="utility-btn video-btn" title="Video Call" type="button" aria-label="Start video call shopping">
          <FiVideo />
        </button>
        <button className="utility-btn whatsapp-btn" title="WhatsApp" type="button" aria-label="Contact on WhatsApp">
          <FiMessageCircle />
        </button>
      </div>

      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 20}%)` }}>
            {carouselSlides.map((slide, index) => (
              <div key={slide.id} className="carousel-slide">
                <div className="slide-image">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    style={{ objectPosition: slide.position || 'center center' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Overlay removed to keep images unobstructed */}
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button className="carousel-nav prev" type="button" aria-label="Previous slide" onClick={prevSlide}>
            <FiChevronLeft />
          </button>
          <button className="carousel-nav next" type="button" aria-label="Next slide" onClick={nextSlide}>
            <FiChevronRight />
          </button>
          
          {/* Dots Indicator */}
          <div className="carousel-dots">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section (clean grid like screenshot) */}
      <section className="new-arrivals">
        <div className="container">
          <h2 className="arrivals-title">New Arrivals In Store</h2>
          {loadingArrivals ? (
            <div className="arrivals-loading">
              <p>Loading new arrivals...</p>
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="arrivals-empty">
              <p>No new arrivals available at the moment.</p>
            </div>
          ) : (
            <div className="arrivals-grid">
              {newArrivals.map(product => (
                <div key={product.id} className="arrival-item">
                  <div className="arrival-image">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/logos/logo.jpg'} 
                      alt={product.name} 
                      loading="lazy" 
                    />
                  </div>
                  <div className="arrival-info">
                    <div className="arrival-top">
                      <div className="arrival-price">₹{product.price.toLocaleString()}</div>
                      <div className="arrival-actions">
                        <a
                          className="icon-btn whatsapp"
                          href={`https://wa.me/?text=${encodeURIComponent('Hi! I am interested in ' + product.name + ' priced at ₹' + product.price.toLocaleString())}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Chat on WhatsApp"
                          title="Chat on WhatsApp"
                        >
                          <FaWhatsapp />
                        </a>
                        <button type="button" className="icon-btn like" aria-label="Add to wishlist" title="Add to wishlist">
                          <FiHeart />
                        </button>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-primary card-btn add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="arrivals-actions">
            <Link to="/products" className="btn-primary">Explore Collection</Link>
          </div>
        </div>
      </section>
      
      <section className="collection-showcase">
        <div className="container">
          <div className="showcase-stage">
            {showcaseSlides.map((slide, index) => {
              const relative = (index - showcaseIndex + showcaseSlides.length) % showcaseSlides.length;
              const positionClass = relative === 0 ? 'is-center' : relative === 1 ? 'is-right' : 'is-left';
              return (
                <div key={slide.id} className={`showcase-card ${positionClass}`}>
                  <img src={slide.image} alt={slide.title} loading="lazy" />
                  <div className="showcase-overlay">
                    <div className="showcase-title">{slide.title}</div>
                    <div className="showcase-sub">{slide.tagline}</div>
                    <button type="button" className="showcase-btn">Shop Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="shop-by-category">
        <div className="container">
          <h2 className="category-title">SHOP BY CATEGORY</h2>
          <div className="category-grid">
            <div className="category-card">
              <div className="category-image">
                <img src="https://wallpapers.com/images/featured/saree-pictures-2d8qt1hau3xlfjdp.jpg" alt="Formal Sarees" loading="lazy" />
              </div>
              <div className="category-label">FORMAL</div>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="https://cdn.shopify.com/s/files/1/0049/3649/9315/files/koskii-beige-stonework-georgette-designer-saree-saus0040039_beige_1_4_large.jpg?v=1748425051" alt="Party Sarees" loading="lazy" />
              </div>
              <div className="category-label">PARTY</div>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="https://yuvti.co.in/cdn/shop/files/2_710522df-d28e-446f-8b19-8686e257c0e6.jpg?v=1692789305&width=2048" alt="Casual Sarees" loading="lazy" />
              </div>
              <div className="category-label">CASUAL</div>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="https://i.pinimg.com/736x/aa/01/7b/aa017b415ae2bec923e2cfa834b8b8d1.jpg" alt="Traditional Sarees" loading="lazy" />
              </div>
              <div className="category-label">TRADITIONAL</div>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?fm=jpg&q=60&w=500&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW4lMjBpbiUyMHNhcmVlfGVufDB8fDB8fHww" alt="Special Occasions Sarees" loading="lazy" />
              </div>
              <div className="category-label">SPECIAL OCCASIONS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrate & Gift Sarees Section */}
      <section className="celebrate-gift-section">
        <div className="container">
          <h2 className="celebrate-title">CELEBRATE & GIFT SAREES</h2>
          <div className="price-filters">
            <button className={`price-filter ${selectedPriceFilter === '20k' ? 'active' : ''}`} onClick={() => setSelectedPriceFilter('20k')}>
              Under 20k
            </button>
            <button className={`price-filter ${selectedPriceFilter === '30k' ? 'active' : ''}`} onClick={() => setSelectedPriceFilter('30k')}>
              Under 30k
            </button>
            <button className={`price-filter ${selectedPriceFilter === '40k' ? 'active' : ''}`} onClick={() => setSelectedPriceFilter('40k')}>
              Under 40k
            </button>
            <button className={`price-filter ${selectedPriceFilter === '50k' ? 'active' : ''}`} onClick={() => setSelectedPriceFilter('50k')}>
              Under 50k
            </button>
            <button className={`price-filter ${selectedPriceFilter === '1lac' ? 'active' : ''}`} onClick={() => setSelectedPriceFilter('1lac')}>
              Under 1lac
            </button>
          </div>
          <div className="gift-products-grid">
            {giftProducts.map(product => (
              <div key={product.id} className="gift-product-card">
                <div className="gift-product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className="gift-product-info">
                  <div className="gift-product-top">
                    <div className="gift-product-price">₹{product.price.toLocaleString()}</div>
                    <div className="gift-product-actions">
                      <a
                        className="icon-btn whatsapp"
                        href={`https://wa.me/?text=${encodeURIComponent('Hi! I am interested in ' + product.name + ' priced at ₹' + product.price.toLocaleString())}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Chat on WhatsApp"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                      <button type="button" className="icon-btn like" aria-label="Add to wishlist" title="Add to wishlist">
                        <FiHeart />
                      </button>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-primary card-btn add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styled for Celebrations - 9 Image Collage */}
      <section className="styled-celebrations">
        <div className="container">
          <h2 className="celebrations-title">STYLED FOR YOUR CELEBRATIONS</h2>
          <div className="celebrations-collage">
            {/* Top Row */}
            <div className="collage-image top-left">
              <img 
                src="https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2lsayUyMHNhcmVlfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000" 
                alt="Three Women in Traditional Sarees" 
                loading="lazy" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#e0e0e0';
                }}
              />
            </div>
            <div className="collage-image top-center">
              <img 
                src="https://m.media-amazon.com/images/I/61LCZqnH4vL._UY1100_.jpg" 
                alt="Woman in Green Saree on Stairs" 
                loading="lazy" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#e0e0e0';
                }}
              />
            </div>
            <div className="collage-image top-right">
              <img 
                src="https://5.imimg.com/data5/SELLER/Default/2021/9/BH/RR/QD/135844775/whatsapp-image-2021-09-04-at-17-51-28.jpeg" 
                alt="Woman in Light Saree with Patterns" 
                loading="lazy" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#e0e0e0';
                }}
              />
            </div>
            
            {/* Middle Row */}
            <div className="collage-image middle-left">
              <img 
                src="https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?fm=jpg&q=80&w=400&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW4lMjBpbiUyMHNhcmVlfGVufDB8fDB8fHww" 
                alt="Woman in Golden Saree" 
                loading="lazy" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#e0e0e0';
                }}
              />
            </div>
            <div className="collage-image center-focal">
              <img 
                src="https://cliosilks.com/cdn/shop/files/Cliojune_250082-4.jpg?v=1754382236&width=3072" 
                alt="Woman with Colorful Saree - Central Focal" 
                loading="lazy" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#e0e0e0';
                }}
              />
            </div>
            {/* Bottom Row - Only left image visible */}
            <div className="collage-image bottom-left">
              <img 
                src="https://thesstudioonline.com/cdn/shop/articles/M7_jpg.webp?v=1690172467" 
                alt="Woman with Fruits" 
                loading="lazy" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#e0e0e0';
                }}
              />
              
            </div>
          </div>
        </div>
      </section>

      {/* About Shanti Silks Section */}
      <section className="about-shanti-silks">
        <div className="container">
          <h2 className="celebrations-title">ABOUT SHANTI SILKS</h2>
          <div className="about-content">
            <div className="about-image">
              <img 
                src="/logos/2.png" 
                alt="Shanti Silk House Logo" 
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#f5f5f5';
                }}
              />
            </div>
            <div className="about-text">
              <h2 className="about-title">Shanti Silk House - Weaving Tradition, Draping Dreams</h2>
              <div className="about-paragraphs">
                <p>
                  Shanti Silk House is a women-led brand born from a deep love for India's rich weaving heritage. 
                  Founded by a passionate female entrepreneur Darshini Gowda, her journey began with a dream – 
                  to celebrate traditional sarees while keeping the essence of Indian culture alive in every thread.
                </p>
                <p>
                  Each saree at Shanti Silk House is handpicked and handcrafted by skilled artisans across India. 
                  From the luxurious Kanchipuram silks to the intricate Banarasi weaves, every piece tells a story 
                  of timeless craftsmanship and grace.
                </p>
                <p>
                  We believe a saree is more than just attire – it's an emotion, a legacy, and a symbol of empowerment. 
                  Our mission is to preserve tradition while blending it beautifully with modern elegance, making every 
                  woman feel confident, proud, and connected to her roots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive offers and new arrivals</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

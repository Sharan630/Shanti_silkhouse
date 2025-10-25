import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ImageCarousel.css';

const ImageCarousel = ({ images, autoPlay = true, interval = 1350, showThumbnails = true, showControls = true, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!images || images.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`image-carousel ${className}`}>
        <div className="carousel-main-image">
          <div className="no-image-placeholder">
            <span>No images available</span>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`image-carousel ${className}`}>
        <div className="carousel-main-image">
          <img 
            src={images[0]} 
            alt="Product" 
            loading="lazy"
            onError={(e) => {
              e.target.src = '/logos/logo.jpg';
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`image-carousel ${className}`}>
      {/* Main Image Container */}
      <div className="carousel-main-image">
        <div className="image-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product view ${index + 1}`}
              className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
              loading="lazy"
              onError={(e) => {
                e.target.src = '/logos/logo.jpg';
              }}
            />
          ))}
        </div>

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <>
            <button
              className="carousel-control prev"
              onClick={goToPrevious}
              aria-label="Previous image"
              type="button"
            >
              <FiChevronLeft />
            </button>
            <button
              className="carousel-control next"
              onClick={goToNext}
              aria-label="Next image"
              type="button"
            >
              <FiChevronRight />
            </button>
          </>
        )}


      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`View image ${index + 1}`}
              type="button"
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/logos/logo.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;

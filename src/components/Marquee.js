import React, { useState, useEffect, useRef } from 'react';
import { FiVideo, FiShoppingBag, FiStar, FiUsers, FiClock } from 'react-icons/fi';
import './Marquee.css';

const Marquee = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const marqueeTrackRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari && marqueeTrackRef.current) {
      let position = 0;
      const speed = 1; 
      
      const animate = () => {
        position -= speed;
        if (position <= -marqueeTrackRef.current.scrollWidth / 2) {
          position = 0;
        }
        marqueeTrackRef.current.style.transform = `translate3d(${position}px, 0, 0)`;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      const startAnimation = setTimeout(() => {
        animate();
      }, 100);
      
      return () => {
        clearTimeout(startAnimation);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, []);

  const marqueeItems = [
    {
      icon: <FiVideo />,
      text: "Video Call Shopping Experience",
      highlight: "Premium"
    },
    {
      icon: <FiShoppingBag />,
      text: "Personal Styling Consultation",
      highlight: "Expert"
    },
    {
      icon: <FiStar />,
      text: "Curated Saree Collection",
      highlight: "Exclusive"
    },
    {
      icon: <FiUsers />,
      text: "One-on-One Expert Guidance",
      highlight: "Personalized"
    },
    {
      icon: <FiClock />,
      text: "Flexible Appointment Booking",
      highlight: "24/7"
    }
  ];

  return (
    <div className={`marquee-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="marquee-content">
        <div className="marquee-scroll">
          <div className="marquee-track" ref={marqueeTrackRef}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="marquee-group">
                <span className="marquee-text">VIDEO CALL SHOPPING</span>
                <span className="marquee-icon">⚡</span>
                <span className="marquee-text">VIDEO CALL SHOPPING</span>
                <span className="marquee-icon">⚡</span>
                <span className="marquee-text">VIDEO CALL SHOPPING</span>
                <span className="marquee-icon">⚡</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;

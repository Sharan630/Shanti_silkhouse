import React, { useState, useEffect } from 'react';
import { FiVideo, FiShoppingBag, FiStar, FiUsers, FiClock } from 'react-icons/fi';
import './Marquee.css';

const Marquee = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <div className="marquee-track">
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

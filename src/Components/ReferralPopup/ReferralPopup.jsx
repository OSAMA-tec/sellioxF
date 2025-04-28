import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes, FaTicketAlt, FaTrophy, FaUserPlus, FaArrowRight, FaGift } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import './ReferralPopup.css';

const ReferralPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  
  // For swipe to dismiss functionality
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const modalRef = useRef(null);

  useEffect(() => {
    // Don't show popup if user is logged in
    if (user) return;
    
    // Check if user clicked on referral link or is on referral-related pages
    const isReferralPath = location.pathname.includes('referral');
    const hasReferralParam = new URLSearchParams(location.search).get('ref');
    
    if (isReferralPath || hasReferralParam) {
      // Show immediately if user clicked on referral link
      setIsVisible(true);
      return;
    }
    
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenReferralPopup');
    
    if (!hasSeenPopup) {
      // Determine if user is on mobile
      const isMobile = window.innerWidth < 768;
      
      // Show popup after delay (5s for desktop, 3s for mobile)
      const delay = isMobile ? 3000 : 5000;
      
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [location, user]);

  const closePopup = () => {
    setIsVisible(false);
    // Mark that user has seen the popup
    localStorage.setItem('hasSeenReferralPopup', 'true');
    // Remove body scroll lock
    document.body.classList.remove('popup-open');
  };
  
  // Add body scroll lock when popup is visible
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }
    
    // Add escape key listener
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isVisible) {
        closePopup();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.classList.remove('popup-open');
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible]);

  const handleGetStarted = () => {
    closePopup();
    navigate('/auth/register');
  };
  
  // Handle touch events for swipe to dismiss (mobile)
  const handleTouchStart = (e) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };
  
  const handleTouchMove = (e) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };
  
  const handleTouchEnd = () => {
    if (touchStartY.current - touchEndY.current > 50) {
      // Swipe up - do nothing
    } else if (touchEndY.current - touchStartY.current > 50) {
      // Swipe down - dismiss
      closePopup();
    }
    // Reset values
    touchStartY.current = 0;
    touchEndY.current = 0;
  };
  
  // Handle click outside modal to close
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closePopup();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 referral-popup-overlay"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="referral-popup-title"
    >
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg max-w-md w-full overflow-hidden animate-fadeIn referral-popup-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors p-2"
          aria-label="Close popup"
        >
          <FaTimes size={20} />
        </button>
        
        {/* Header */}
        <div className="text-white p-6 text-center referral-popup-header">
          <div className="flex items-center justify-center mb-2">
            <FaTrophy className="text-4xl mr-2" />
            <FaGift className="text-3xl ml-2" />
          </div>
          <h2 id="referral-popup-title" className="text-2xl font-bold">Win $1,000 Every Month!</h2>
        </div>
        
        {/* Content */}
        <div className="p-6 referral-popup-content">
          <p className="text-gray-700 mb-5 text-center">
            Join our referral program and earn tickets to our monthly $1,000 prize draw!
          </p>
          
          <div className="space-y-5 mb-6">
            <div className="flex items-start referral-popup-benefit">
              <div className="bg-primaryA0/10 p-2 rounded-full mr-3 flex-shrink-0 referral-popup-benefit-icon">
                <FaTicketAlt className="text-primaryA0" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Earn Tickets</h3>
                <p className="text-sm text-gray-600">Get 1 ticket when someone signs up with your code, 5 more when they create a listing</p>
              </div>
            </div>
            
            <div className="flex items-start referral-popup-benefit">
              <div className="bg-primaryA0/10 p-2 rounded-full mr-3 flex-shrink-0 referral-popup-benefit-icon">
                <FaUserPlus className="text-primaryA0" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Help Friends Save</h3>
                <p className="text-sm text-gray-600">Your friends get their first month FREE when they use your referral code</p>
              </div>
            </div>
            
            <div className="flex items-start referral-popup-benefit">
              <div className="bg-primaryA0/10 p-2 rounded-full mr-3 flex-shrink-0 referral-popup-benefit-icon">
                <FaTrophy className="text-primaryA0" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Monthly Prize Draw</h3>
                <p className="text-sm text-gray-600">Every ticket is an entry into our $1,000 monthly prize draw - more tickets, more chances!</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleGetStarted}
            className="w-full bg-primaryA0 hover:bg-primaryA0/90 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors animate-pulse-once referral-popup-button"
            aria-label="Get started with referral program"
          >
            <span>Get Started Now</span>
            <FaArrowRight size={14} />
          </button>
          
          <p className="text-sm text-gray-500 text-center mt-5">
            Already have an account? <button onClick={() => navigate('/auth/login')} className="text-primaryA0 hover:underline font-medium">Sign in</button>
          </p>
          
          <p className="text-xs text-gray-400 text-center mt-3">
            You can access the referral program anytime from your account menu
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralPopup;

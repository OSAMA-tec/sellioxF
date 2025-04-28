import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShare, FaTicketAlt, FaTrophy, FaHome, FaClipboard, FaClipboardCheck, FaFacebook, FaEnvelope, FaWhatsapp, FaSms } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getUserReferralCode, createReferralUrl } from '../../../utils/referralCode';

export default function SignupSuccessPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [hasNewTicket, setHasNewTicket] = useState(false);
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    // Get consistent referral code using our utility function
    const code = getUserReferralCode(user);
    setReferralCode(code);
    
    // Create share URL with referral code
    setShareUrl(createReferralUrl(code));
    
    // Check if user signed up with a referral code
    const hasNewReferralTicket = localStorage.getItem('hasNewReferralTicket');
    if (hasNewReferralTicket === 'true') {
      setHasNewTicket(true);
      // Clear the flag after reading it to prevent showing the notification again
      localStorage.removeItem('hasNewReferralTicket');
    }
  }, [user, navigate]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = (platform) => {
    const shareText = "Hey! Use my referral code to join Selliox and get your first month FREE! OR, you'll be entered into our $1,000 monthly prize draw.";
    let shareLink = "";
    
    try {
      switch (platform) {
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
          window.open(shareLink, "_blank", "width=600,height=400");
          break;
        case "email":
          shareLink = `mailto:?subject=${encodeURIComponent("Join Selliox with my referral code")}&body=${encodeURIComponent(shareText + " Use code: " + referralCode + " " + shareUrl)}`;
          window.location.href = shareLink;
          break;
        case "whatsapp":
          shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " Use code: " + referralCode + " " + shareUrl)}`;
          window.open(shareLink, "_blank");
          break;
        case "sms":
          // For mobile devices
          if (/Android|iPhone/i.test(navigator.userAgent)) {
            shareLink = `sms:?body=${encodeURIComponent(shareText + " Use code: " + referralCode + " " + shareUrl)}`;
            window.location.href = shareLink;
          } else {
            // Copy to clipboard and show instructions
            navigator.clipboard.writeText(`${shareText} Use code: ${referralCode} ${shareUrl}`);
            alert("Message copied to clipboard! Paste it into your messaging app to share.");
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error sharing content:", error);
      // Fallback to clipboard copy if sharing fails
      try {
        navigator.clipboard.writeText(`${shareText} Use code: ${referralCode} ${shareUrl}`);
        alert("Message copied to clipboard! Paste it to share.");
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
        alert("Unable to share. Please copy this code manually: " + referralCode);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-primaryA0 text-white p-6 text-center">
            <FaCheckCircle className="mx-auto text-5xl mb-4" />
            <h1 className="text-2xl font-bold">Thanks for signing up!</h1>
            <p className="mt-2">Your account has been successfully created</p>
          </div>
          
          {/* Main Content */}
          <div className="p-6">
            {/* Welcome Message */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl font-semibold text-gray-800">Welcome to Selliox, {user?.fullName || 'New User'}!</h2>
              <p className="text-gray-600 mt-2 px-1">
               {` Your account has been created and you've earned your first ticket for our monthly prize draw.`}
              </p>
            </div>
            
            {/* Referral Code Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Your Referral Code</h3>
              
              <div className="flex items-center justify-between bg-white border rounded-lg p-3 mb-4">
                <span className="font-medium text-gray-700">{referralCode}</span>
                <button 
                  onClick={copyToClipboard}
                  className="text-primaryA0 hover:text-primaryA0/80 transition-colors"
                  aria-label="Copy referral code"
                >
                  {copied ? <FaClipboardCheck size={20} /> : <FaClipboard size={20} />}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Share your referral code with friends and earn rewards when they sign up!
              </p>
              
              {/* Share Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center">
                <button 
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FaFacebook size={16} />
                  <span>Facebook</span>
                </button>
                <button 
                  onClick={() => handleShare('email')}
                  className="flex items-center justify-center gap-2 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <FaEnvelope size={16} />
                  <span>Email</span>
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <FaWhatsapp size={16} />
                  <span>WhatsApp</span>
                </button>
                <button 
                  onClick={() => handleShare('sms')}
                  className="flex items-center justify-center gap-2 bg-blue-400 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm"
                >
                  <FaSms size={16} />
                  <span>Text</span>
                </button>
              </div>
            </div>
            
            {/* How It Works */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">How It Works</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="bg-primaryA0/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                    <FaShare className="text-primaryA0 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Share Your Code</h4>
                  <p className="text-sm text-gray-600">Share your unique referral code with friends and colleagues</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="bg-primaryA0/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                    <FaTicketAlt className="text-primaryA0 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Earn Tickets</h4>
                  <p className="text-sm text-gray-600">Get 1 ticket when they sign up, 5 when they create a listing</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="bg-primaryA0/10 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                    <FaTrophy className="text-primaryA0 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Win Prizes</h4>
                  <p className="text-sm text-gray-600">Enter monthly $1,000 prize draws with your tickets</p>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link 
                to="/"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                <FaHome size={16} className="flex-shrink-0" />
                <span>Go to Homepage</span>
              </Link>
              
              <Link 
                to="/referral-dashboard"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-6 py-3 rounded-lg transition-colors relative text-sm sm:text-base"
              >
                <FaShare size={16} className="flex-shrink-0" />
                <span>Referral Dashboard</span>
                {hasNewTicket && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                )}
              </Link>
              
              <Link 
                to="/addList"
                className="flex items-center justify-center gap-2 bg-primaryA0 hover:bg-primaryA0/90 text-white px-3 sm:px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                <FaClipboard size={16} className="flex-shrink-0" />
                <span>Create a Listing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

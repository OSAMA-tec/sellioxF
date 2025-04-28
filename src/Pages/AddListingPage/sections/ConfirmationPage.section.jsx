import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserReferralCode, createReferralUrl } from '../../../utils/referralCode';
import { FaCheck, FaShare, FaCopy, FaFacebook, FaTwitter, FaLinkedin, FaGift, FaWhatsapp, FaEnvelope, FaTicketAlt, FaListUl, FaUser, FaClipboardCheck } from "react-icons/fa";

const ConfirmationPageSection = ({ referralUsed }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const [userReferralCode, setUserReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [listingData, setListingData] = useState(null);
  const [ticketsEarned, setTicketsEarned] = useState(0);

  // Get the user's referral code and set up listing data
  useEffect(() => {
    if (user) {
      // Get consistent referral code using our utility function
      const code = getUserReferralCode(user);
      setUserReferralCode(code);
      
      // For demo purposes, set some mock listing data
      setListingData({
        id: `listing-${Date.now()}`,
        title: user.businessName || "My Business Listing",
        category: "Professional Services",
        location: "Auckland, New Zealand"
      });
      
      // Calculate tickets earned
      // Base tickets for creating a listing
      const baseTickets = 5;
      setTicketsEarned(baseTickets);
    }
  }, [user]);
  
  // Set up share URL
  useEffect(() => {
    if (!userReferralCode) return;
    
    setShareUrl(createReferralUrl(userReferralCode));
  }, [userReferralCode]);

  // Handle copy referral code to clipboard
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(userReferralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Handle social sharing
  const handleShare = (platform) => {
    let shareLink = "";
    const shareText = `Check out my new listing on Selliox: ${listingData?.title || "My Business"}. Use my referral code ${userReferralCode} for a FREE first month!`;
    const emailSubject = "Join me on Selliox - Get your first month FREE!";
    const emailBody = `Hi there,\n\nI just created a listing on Selliox and wanted to share my referral code with you. Use code ${userReferralCode} when you sign up to get your first month FREE!\n\nCheck it out: ${shareUrl}\n\nThanks,\n${user?.name || "A friend"}`;  
    
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, "_blank", "width=600,height=400");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Banner */}
      <div className="bg-green-500 text-white p-6 rounded-lg mb-6 text-center">
        <div className="flex justify-center mb-2">
          <FaCheck className="text-white text-2xl" />
        </div>
        <h2 className="text-xl font-semibold mb-1">Payment Successful!</h2>
        <p>Your listing is now live</p>
      </div>
      
      {/* Confirmation Message */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-center">
        <p className="text-gray-700">
          Thank you for your payment. Your listing has been successfully
          published and is now visible to all users.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex justify-center mb-3">
            <div className="text-gray-700">
              <FaListUl size={24} />
            </div>
          </div>
          <h3 className="font-medium mb-1">View My Listings</h3>
          <p className="text-sm text-gray-500 mb-4">Manage your active listings</p>
          <button 
            onClick={() => navigate('/mylistings')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all w-full"
          >
            Go to My Listings
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
          <div className="flex justify-center mb-3">
            <div className="text-gray-700">
              <FaUser size={24} />
            </div>
          </div>
          <h3 className="font-medium mb-1">Dashboard</h3>
          <p className="text-sm text-gray-500 mb-4">View your account dashboard</p>
          <button 
            onClick={() => navigate('/account')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      
      {/* Referral Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="font-medium mb-4 text-center">Share with others and earn rewards!</h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Refer others to create listings and get a free month or draw entries for a chance to win $1,000!
        </p>
        
        {/* Referral Code */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-700">{userReferralCode}</div>
            <button 
              onClick={handleCopyReferralCode}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Copy referral code"
            >
              {copied ? <FaClipboardCheck size={20} /> : <FaCopy size={20} />}
            </button>
          </div>
        </div>
        
        {/* Referral Dashboard Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/referral-dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Go to Referral Dashboard</span>
          </button>
        </div>
        
        {/* Social Sharing */}
        <div className="mt-6 text-center">
          <h4 className="font-medium mb-3">Share Your Referral Link</h4>
          <p className="text-sm text-gray-600 mb-3">Invite friends to join Selliox using these platforms:</p>
          
          {/* First row of sharing options */}
          <div className="flex gap-3 mb-3">
            <button 
              onClick={() => handleShare("facebook")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1877F2]/90 transition-colors"
            >
              <FaFacebook />
              <span>Facebook</span>
            </button>
            <button 
              onClick={() => handleShare("twitter")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1DA1F2] text-white rounded-md hover:bg-[#1DA1F2]/90 transition-colors"
            >
              <FaTwitter />
              <span>Twitter</span>
            </button>
            <button 
              onClick={() => handleShare("linkedin")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#0A66C2]/90 transition-colors"
            >
              <FaLinkedin />
              <span>LinkedIn</span>
            </button>
          </div>
          
          {/* Second row of sharing options */}
          <div className="flex gap-3">
            <button 
              onClick={() => handleShare("whatsapp")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-md hover:bg-[#25D366]/90 transition-colors"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={() => handleShare("email")}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#EA4335] text-white rounded-md hover:bg-[#EA4335]/90 transition-colors"
            >
              <FaEnvelope />
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Next steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">What's Next?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primaryA0 text-white rounded-full flex items-center justify-center font-medium">1</div>
            <div>
              <h4 className="font-medium text-gray-800">Track Your Referrals</h4>
              <p className="text-gray-600">Visit your referral dashboard to see who has used your code and what rewards you've earned.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primaryA0 text-white rounded-full flex items-center justify-center font-medium">2</div>
            <div>
              <h4 className="font-medium text-gray-800">Respond to Inquiries</h4>
              <p className="text-gray-600">Check your messages regularly to respond to customer inquiries quickly.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primaryA0 text-white rounded-full flex items-center justify-center font-medium">3</div>
            <div>
              <h4 className="font-medium text-gray-800">Share Your Referral Code</h4>
              <p className="text-gray-600">Use the sharing tools above to invite friends and earn rewards.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate("/referral/dashboard")}
            className="px-6 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors"
          >
            Go to Referral Dashboard
          </button>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationPageSection.propTypes = {
  referralUsed: PropTypes.bool,
};

export default ConfirmationPageSection;

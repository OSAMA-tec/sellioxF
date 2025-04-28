import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaListAlt, FaGift, FaCopy, FaClipboardCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import { toast } from 'react-toastify';
import { getUserReferralCode, createReferralUrl } from '../../utils/referralCode';

export default function PaymentSuccessPage() {
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    // Get consistent referral code using our utility function
    const code = getUserReferralCode(user);
    setReferralCode(code);
    setIsLoading(false);
  }, [user, navigate]);
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
      .then(() => toast.success('Referral code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy code'));
  };
  
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-500 p-6 text-white text-center">
          <FaCheckCircle className="text-5xl mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="opacity-90">Your listing is now live</p>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-lg mb-6">
            Thank you for your payment. Your listing has been successfully published and is now visible to all users.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              to="/mylistings/mylistings"
              className="flex flex-col items-center p-6 rounded-lg border hover:border-primaryA0 hover:shadow-md transition-all"
            >
              <FaListAlt className="text-4xl text-primaryA0 mb-3" />
              <h3 className="font-medium">View My Listings</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your active listings</p>
            </Link>
            
            <Link
              to="/referral"
              className="flex flex-col items-center p-6 rounded-lg border hover:border-primaryA0 hover:shadow-md transition-all"
            >
              <FaGift className="text-4xl text-primaryA0 mb-3" />
              <h3 className="font-medium">Referral Program</h3>
              <p className="text-sm text-gray-600 mt-1">Share your code and earn rewards</p>
            </Link>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-medium mb-2">Share with others and earn rewards!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Refer others to create listings and get a free month or draw entries for a chance to win $1,000!
            </p>
            
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-12 rounded-lg w-48 mx-auto mb-4"></div>
            ) : (
              <div className="mb-4">
                <p className="font-medium mb-2">Your Referral Code:</p>
                <div className="inline-flex mx-auto">
                  <div className="bg-white border rounded-l-lg px-4 py-2 font-mono text-lg font-medium">
                    {referralCode}
                  </div>
                  <button 
                    onClick={copyReferralCode}
                    className="bg-primaryA0 text-white rounded-r-lg px-4 py-2 hover:bg-primaryA0/90 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            
            <Link
              to="/referral"
              className="inline-block px-5 py-2 bg-primaryA0 text-white rounded font-medium hover:bg-primaryA0/90 transition-colors"
            >
              Go to Referral Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
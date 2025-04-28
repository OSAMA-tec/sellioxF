import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaHome, FaGift, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../utils/axiosInstance/axiosInstance';
import { toast } from 'react-toastify';

export default function RegisterSuccessPage() {
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const user = useSelector(state => state.user.user);
  
  useEffect(() => {
    if (user) {
      generateReferralCode();
    }
  }, [user]);
  
  const generateReferralCode = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/referral/generate-code');
      setReferralCode(response.data.code);
    } catch (error) {
      console.error('Error generating referral code:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
          <h1 className="text-2xl font-bold">Registration Successful!</h1>
          <p className="opacity-90">Your account has been created</p>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-lg mb-8">
            Thank you for joining Selliox! Your account has been successfully created.
          </p>
          
          <div className="bg-gray-50 p-5 rounded-lg border mb-8">
            <h3 className="font-medium mb-3">Your Referral Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share this code with others and get rewards when they create listings!
            </p>
            
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-12 rounded-lg w-48 mx-auto"></div>
            ) : (
              <div className="flex justify-center items-center mb-4">
                <div className="bg-white border rounded-l-lg px-4 py-3 font-mono text-lg font-medium">
                  {referralCode}
                </div>
                <button 
                  onClick={copyReferralCode}
                  className="bg-primaryA0 text-white rounded-r-lg px-4 py-3 hover:bg-primaryA0/90 transition-colors"
                >
                  <FaCopy />
                </button>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              Every time someone uses your code, you can choose between a free month or 5 draw entries!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center p-6 rounded-lg border hover:border-primaryA0 hover:shadow-md transition-all"
            >
              <FaHome className="text-4xl text-primaryA0 mb-3" />
              <h3 className="font-medium">Go to Homepage</h3>
              <p className="text-sm text-gray-600 mt-1">Start exploring listings</p>
            </Link>
            
            <Link
              to="/referral"
              className="flex flex-col items-center p-6 rounded-lg border hover:border-primaryA0 hover:shadow-md transition-all"
            >
              <FaGift className="text-4xl text-primaryA0 mb-3" />
              <h3 className="font-medium">Referral Dashboard</h3>
              <p className="text-sm text-gray-600 mt-1">Track your referrals and entries</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
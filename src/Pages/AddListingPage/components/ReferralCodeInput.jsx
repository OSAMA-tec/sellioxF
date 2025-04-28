import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance/axiosInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getUserReferralCode } from '../../../utils/referralCode';

export default function ReferralCodeInput({ onValidCode, useForFreeMonth, setUseForFreeMonth }) {
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [userOwnCode, setUserOwnCode] = useState('');
  
  // Get the current user from Redux
  const user = useSelector(state => state.user.user);
  
  // Get the user's own referral code
  useEffect(() => {
    if (user) {
      const ownCode = getUserReferralCode(user);
      setUserOwnCode(ownCode);
    }
  }, [user]);
  
  // Debounce function to prevent too many API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced validation function
  const debouncedValidate = React.useCallback(
    debounce((code) => {
      if (code && code.length >= 3) {
        validateCode(code);
      }
    }, 500),
    [userOwnCode]
  );

  // Effect to run validation when code changes
  useEffect(() => {
    if (referralCode && referralCode.length >= 3) {
      debouncedValidate(referralCode);
    }
  }, [referralCode, debouncedValidate]);

  const validateCode = async (code = referralCode) => {
    if (!code) return;
    
    // Check if user is trying to use their own referral code
    if (code === userOwnCode) {
      setIsValid(false);
      onValidCode(null);
      toast.error('You cannot use your own referral code');
      return;
    }
    
    setIsValidating(true);
    try {
      // We don't actually apply the code yet, just validate it
      const response = await axiosInstance.get(`/referral/validate-code/${code}`);
      
      setIsValid(true);
      setShowOptions(true);
      onValidCode(code);
      toast.success('Referral code is valid!');
      
      // Store the valid referral code in localStorage
      localStorage.setItem('usedReferralCode', code);
    } catch (error) {
      console.error('Error validating referral code:', error);
      setIsValid(false);
      onValidCode(null);
      toast.error(error.response?.data?.message || 'Invalid referral code');
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleCodeChange = (e) => {
    const newValue = e.target.value.toUpperCase().trim();
    setReferralCode(newValue);
    
    // Only reset validation state if the input is cleared or significantly changed
    if (!newValue || (isValid && newValue.length < 3)) {
      setIsValid(null);
    }
  };
  
  const handleBlur = () => {
    // Only validate on blur if we have a complete code and it hasn't been validated yet
    if (referralCode && referralCode.length >= 3 && isValid === null) {
      validateCode();
    }
  };
  
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-medium mb-3">Referral Code</h3>
      <p className="text-sm text-gray-600 mb-3">
        If you have a referral code, enter it below to get your first month free!
      </p>
      
      <div className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={referralCode}
            onChange={handleCodeChange}
            onBlur={handleBlur}
            placeholder="Enter referral code"
            className={`w-full p-3 border rounded-l focus:outline-none focus:ring-2 focus:ring-primaryA0/30 ${
              isValid === true ? 'border-green-500' : 
              isValid === false ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={8}
            autoComplete="off"
          />
          {isValid !== null && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={validateCode}
          disabled={!referralCode || isValidating}
          className="px-4 py-3 bg-primaryA0 text-white rounded-r hover:bg-primaryA0/90 transition-colors disabled:opacity-50"
        >
          {isValidating ? 'Checking...' : 'Apply'}
        </button>
      </div>
      
      {showOptions && isValid && (
        <div className="mt-4 bg-gray-50 p-4 rounded border">
          <h4 className="font-medium mb-2 flex items-center">
            <FaInfoCircle className="text-primaryA0 mr-2" />
            Choose Your Reward
          </h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <div 
              className={`flex-1 border rounded p-3 cursor-pointer ${useForFreeMonth ? 'border-primaryA0 bg-primaryA0/5' : 'border-gray-300'}`}
              onClick={() => setUseForFreeMonth(true)}
            >
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  checked={useForFreeMonth} 
                  onChange={() => setUseForFreeMonth(true)}
                  id="free-month"
                  className="mr-2" 
                />
                <label htmlFor="free-month" className="font-medium">Free Month</label>
              </div>
              <p className="text-sm text-gray-600">Get your first month of subscription for free!</p>
            </div>
            
            <div 
              className={`flex-1 border rounded p-3 cursor-pointer ${!useForFreeMonth ? 'border-primaryA0 bg-primaryA0/5' : 'border-gray-300'}`}
              onClick={() => setUseForFreeMonth(false)}
            >
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  checked={!useForFreeMonth} 
                  onChange={() => setUseForFreeMonth(false)}
                  id="draw-entries"
                  className="mr-2" 
                />
                <label htmlFor="draw-entries" className="font-medium">Draw Entries</label>
              </div>
              <p className="text-sm text-gray-600">Get 5 entries for the $1,000 monthly draw!</p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Don't have a code? Complete your listing and get your own referral code to share!
      </p>
    </div>
  );
} 
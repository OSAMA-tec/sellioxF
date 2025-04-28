import React, { useState, useEffect } from 'react';
import { FaTrophy, FaCheck, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../utils/errorHandler';

export default function ClaimPrizePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [winningDraw, setWinningDraw] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      checkWinnerStatus();
    }
  }, [user]);
  
  const checkWinnerStatus = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/referral/check-winner');
      if (response.data.isWinner) {
        setWinningDraw(response.data.draw);
        
        // Check if payment details already submitted
        if (response.data.draw.paymentStatus === 'claimed' || response.data.draw.paymentStatus === 'paid') {
          setIsSubmitted(true);
        }
      } else {
        // Not a winner, redirect to referral dashboard
        toast.info('You are not currently a draw winner');
        navigate('/referral');
      }
    } catch (error) {
      handleError(error, 'checkWinnerStatus', {
        fallbackMessage: 'Error checking winner status',
        onError: () => navigate('/referral')
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.bankName || !formData.accountHolder || !formData.accountNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axiosInstance.post('/referral/payment-details', formData);
      toast.success('Payment details submitted successfully');
      setIsSubmitted(true);
    } catch (error) {
      handleError(error, 'submitPaymentDetails', {
        fallbackMessage: 'Error submitting payment details'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };
  
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 flex justify-center">
        <FaSpinner className="text-primaryA0 text-2xl animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-6 text-white">
          <div className="flex items-center">
            <FaTrophy className="text-4xl mr-4" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="opacity-90">You've won the monthly draw</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h2 className="text-lg font-medium">Prize Amount</h2>
              <p className="text-3xl font-bold text-primaryA0">${winningDraw?.prizeAmount || 1000}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-medium">Draw Date</h2>
              <p className="text-gray-600">
                {winningDraw?.drawDate ? 
                  new Date(winningDraw.drawDate).toLocaleDateString() : 
                  `${getMonthName(winningDraw?.month || 0)} ${winningDraw?.year || new Date().getFullYear()}`
                }
              </p>
            </div>
          </div>
          
          {isSubmitted ? (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <div className="flex items-center text-green-700 mb-2">
                <FaCheck className="mr-2" aria-hidden="true" />
                <h3 className="font-medium">Payment Details Submitted</h3>
              </div>
              <p className="text-green-600 text-sm">
                Your payment details have been submitted successfully. We'll process your payment within 3-5 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-medium mb-4">Enter Your Payment Details</h3>
              
              <div className="mb-4">
                <label htmlFor="bankName" className="block text-gray-700 text-sm font-medium mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primaryA0"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="accountHolder" className="block text-gray-700 text-sm font-medium mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="accountHolder"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primaryA0"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="accountNumber" className="block text-gray-700 text-sm font-medium mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primaryA0"
                  required
                  disabled={isSubmitting}
                  aria-describedby="accountSecurity"
                />
                <p id="accountSecurity" className="mt-1 text-xs text-gray-500">
                  Your account information is encrypted and secure.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primaryA0 text-white rounded font-medium hover:bg-primaryA0/90 transition-colors disabled:opacity-70"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" aria-hidden="true" />
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Submit Payment Details'
                )}
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 border-t">
          <h3 className="font-medium mb-2">Important Notes</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Please ensure your banking details are correct</li>
            <li>Payment will be processed within 3-5 business days</li>
            <li>For any issues, please contact our support team</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
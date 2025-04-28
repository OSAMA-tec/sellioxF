import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCopy, FaTicketAlt, FaCalendarAlt, FaClock, FaEnvelope, FaWhatsapp, FaSms, FaUserPlus, FaUserCheck, FaCoins, FaTrophy } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { handleError } from '../../utils/errorHandler';

export default function ReferralPage() {
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    referralCode: null,
    totalTickets: 0,
    drawEntries: [],
    currentDraw: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      daysUntilDraw: 0,
      hoursUntilDraw: 0
    },
    isWinner: false
  });
  
  const user = useSelector(state => state.user.user);
  
  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);
  
  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/referral/user-data');
      setReferralData(response.data);
    } catch (error) {
      handleError(error, 'fetchReferralData', {
        fallbackMessage: 'Failed to load referral data'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // We're not generating a new code every time, just fetching the existing one
  // This function is kept for backward compatibility but will be removed in future
  const generateReferralCode = async () => {
    try {
      // Instead of generating a new code, we'll just fetch the existing one
      const response = await axiosInstance.get('/referral/user-data');
      if (response.data.referralCode) {
        setReferralData(prevData => ({
          ...prevData,
          referralCode: response.data.referralCode
        }));
        toast.success('Referral code retrieved!');
      } else {
        // If no code exists yet, create one
        const newCodeResponse = await axiosInstance.post('/referral/generate-code');
        setReferralData(prevData => ({
          ...prevData,
          referralCode: newCodeResponse.data.code
        }));
        toast.success('Referral code generated!');
      }
    } catch (error) {
      handleError(error, 'generateReferralCode', {
        fallbackMessage: 'Failed to retrieve referral code'
      });
    }
  };
  
  const copyReferralCode = () => {
    if (referralData.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode)
        .then(() => toast.success('Referral code copied to clipboard!'))
        .catch((error) => handleError(error, 'copyReferralCode', {
          fallbackMessage: 'Failed to copy code',
          showToast: true
        }));
    }
  };
  
  const shareByEmail = () => {
    const subject = 'Join Selliox and get rewards!';
    const body = `Hi there,

I'm using Selliox for my listings and thought you might be interested. If you sign up using my referral code (${referralData.referralCode}), you'll get special benefits!

Just enter this code when creating your listing: ${referralData.referralCode}

Thanks!`;
    
    try {
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (error) {
      handleError(error, 'shareByEmail', {
        fallbackMessage: 'Failed to open email client',
        showToast: true
      });
    }
  };
  
  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };
  
  const formatDrawDate = (month, year) => {
    return `${getMonthName(month)} ${year}`;
  };
  
  const renderCountdown = () => {
    const { daysUntilDraw, hoursUntilDraw } = referralData.currentDraw;
    
    return (
      <div className="mt-4">
        <div className="flex justify-center gap-4">
          <div className="bg-gradient-to-b from-primaryA0/10 to-primaryA0/5 rounded-lg p-3 w-20 text-center">
            <div className="text-2xl font-bold text-primaryA0">{daysUntilDraw}</div>
            <div className="text-xs text-gray-600">DAYS</div>
          </div>
          <div className="bg-gradient-to-b from-primaryA0/10 to-primaryA0/5 rounded-lg p-3 w-20 text-center">
            <div className="text-2xl font-bold text-primaryA0">{hoursUntilDraw}</div>
            <div className="text-xs text-gray-600">HOURS</div>
          </div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500 flex items-center justify-center">
          <IoMdTime className="mr-1" /> Until next draw
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryA0"></div>
      </div>
    );
  }
  
  // Redirect to claim prize if user is a winner
  if (referralData.isWinner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Congratulations! You've won the monthly draw! <Link to="/referral/claim-prize" className="font-medium underline">Claim your prize now</Link>.
              </p>
            </div>
          </div>
        </div>
        
        {/* Rest of the dashboard content */}
        {renderDashboardContent()}
      </div>
    );
  }
  
  return renderDashboardContent();
  
  function renderDashboardContent() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Referral Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Referral Code */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Referral Code</h2>
              
              {!referralData.referralCode ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Generate your unique referral code to share with friends. When they use your code while creating a listing, you'll earn rewards!
                  </p>
                  <button
                    onClick={generateReferralCode}
                    className="bg-primaryA0 text-white py-2 px-4 rounded hover:bg-primaryA0/90 transition-colors"
                  >
                    Generate Referral Code
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Share this code with friends. When they use it while creating a listing, you'll earn rewards!
                  </p>
                  
                  <div className="flex mb-6">
                    <div className="bg-gray-100 border rounded-l-lg px-4 py-3 font-mono text-lg font-medium flex-grow">
                      {referralData.referralCode}
                    </div>
                    <button 
                      onClick={copyReferralCode}
                      className="bg-primaryA0 text-white rounded-r-lg px-4 py-3 hover:bg-primaryA0/90 transition-colors"
                      aria-label="Copy referral code"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-3">Share your code</h3>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors flex-1"
                      aria-label="Copy to clipboard"
                    >
                      <FaCopy /> <span>Copy</span>
                    </button>
                    <button
                      onClick={shareByEmail}
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors flex-1"
                      aria-label="Share by email"
                    >
                      <FaEnvelope /> <span>Email</span>
                    </button>
                    <a
                      href={`sms:?&body=${encodeURIComponent(`Use my referral code ${referralData.referralCode} when creating your listing on Selliox! ${window.location.origin}`)}`}
                      className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors flex-1 text-center"
                      aria-label="Share by SMS"
                    >
                      <FaSms /> <span>Text</span>
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Use my referral code ${referralData.referralCode} when creating your listing on Selliox! ${window.location.origin}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors flex-1 text-center"
                      aria-label="Share on WhatsApp"
                    >
                      <FaWhatsapp /> <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Draw Entries Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Draw Entries</h2>
                <div className="flex items-center gap-2 bg-gradient-to-r from-primaryA0 to-primaryA0/80 text-white py-2 px-4 rounded-lg text-lg font-bold">
                  <FaTicketAlt />
                  <span>{referralData.totalTickets}</span>
                </div>
              </div>
              
              {referralData.drawEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                  <FaTicketAlt className="mx-auto text-4xl mb-2 text-gray-300" />
                  <p>You don't have any draw entries yet.</p>
                  <p className="mt-2">Share your referral code to earn entries!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {referralData.drawEntries.slice(0, 5).map((entry, index) => (
                    <div key={entry._id || index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        {entry.type === 'signup' ? (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaUserPlus />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <FaUserCheck />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {entry.type === 'signup' ? 'User Signup' : 'Listing Created'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-primaryA0/10 text-primaryA0 py-1 px-3 rounded-lg font-medium">
                        <FaTicketAlt size={14} />
                        <span>{entry.tickets}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Draw Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primaryA0/10 rounded-bl-full z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-4">Monthly Draw</h2>
                
                <div className="text-center py-4">
                  <div className="flex justify-center items-center mb-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-primaryA0/10 flex items-center justify-center">
                        <FaCoins className="text-4xl text-primaryA0" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                        <FaTrophy className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-transparent bg-clip-text">$1,000</h3>
                  <p className="text-gray-500 mb-2">Prize Pool</p>
                  
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-medium text-gray-700">Draw Date</h4>
                    <p className="text-gray-700 font-semibold">
                      {formatDrawDate(referralData.currentDraw.month, referralData.currentDraw.year)}
                    </p>
                    {renderCountdown()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">How It Works</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center text-lg flex-shrink-0 mr-3">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Share your code</p>
                    <p className="text-sm text-gray-600">Send your unique referral code to friends</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-lg w-10 h-10 flex items-center justify-center text-lg flex-shrink-0 mr-3">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Earn tickets</p>
                    <p className="text-sm text-gray-600">Get 1 ticket when they sign up, 5 when they create a listing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 text-amber-600 rounded-lg w-10 h-10 flex items-center justify-center text-lg flex-shrink-0 mr-3">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Win prizes</p>
                    <p className="text-sm text-gray-600">Each ticket is an entry to win $1,000 monthly</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
} 
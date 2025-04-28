import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaGift, FaCopy, FaFacebook, FaTwitter, FaLinkedin, 
  FaSms, FaTrophy, FaTicketAlt, FaUserPlus, FaListUl,
  FaExternalLinkAlt, FaCalendarAlt, FaEnvelope, FaWhatsapp,
  FaShare
} from 'react-icons/fa';
import { getUserReferralCode, createReferralUrl } from '../../utils/referralCode';
import ReferralNotificationDemo from '../../Components/ReferralNotification/ReferralNotificationDemo';

const ReferralDashboardPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [activeTab, setActiveTab] = useState("entries");
  const [shareMethod, setShareMethod] = useState(null);
  
  // Mock data for draw entries
  const [drawEntries, setDrawEntries] = useState([
    { 
      id: 1, 
      username: "johndoe", 
      date: "2025-04-15T10:30:00", 
      action: "signup", 
      tickets: 1,
      status: "completed" 
    },
    { 
      id: 2, 
      username: "sarahsmith", 
      date: "2025-04-12T14:22:00", 
      action: "listing", 
      tickets: 5,
      status: "completed" 
    },
    { 
      id: 3, 
      username: "mikebrown", 
      date: "2025-04-10T09:15:00", 
      action: "signup", 
      tickets: 1,
      status: "completed" 
    },
    { 
      id: 4, 
      username: "emilyjones", 
      date: "2025-04-05T16:45:00", 
      action: "listing", 
      tickets: 5,
      status: "completed" 
    }
  ]);
  
  // Mock data for monthly draws
  const [monthlyDraws, setMonthlyDraws] = useState([
    {
      id: 1,
      month: "April 2025",
      drawDate: "2025-04-30T12:00:00",
      prize: "$1,000 Premium Listing Package",
      status: "upcoming",
      ticketsEntered: 12,
      winningTicket: null
    },
    {
      id: 2,
      month: "March 2025",
      drawDate: "2025-03-31T12:00:00",
      prize: "$1,000 Premium Listing Package",
      status: "completed",
      ticketsEntered: 8,
      winningTicket: "T-8721",
      winner: "alexwilson"
    },
    {
      id: 3,
      month: "February 2025",
      drawDate: "2025-02-28T12:00:00",
      prize: "$1,000 Premium Listing Package",
      status: "completed",
      ticketsEntered: 5,
      winningTicket: "T-5432",
      winner: "jenniferk"
    }
  ]);
  
  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!user) {
      navigate('/auth/login?redirect=/referral-dashboard');
    }
  }, [user, navigate]);

  // Get the user's referral code
  useEffect(() => {
    if (user) {
      // Get consistent referral code using our utility function
      const code = getUserReferralCode(user);
      setReferralCode(code);
      
      // Create share URL with referral code
      setShareUrl(createReferralUrl(code));
    }
  }, [user]);
  
  // Handle copy referral code to clipboard
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle copy referral link to clipboard
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle social sharing
  const handleShare = (platform) => {
    setShareMethod(platform);
    
    // Pre-filled message for all sharing methods
    const shareText = "Hey! Use my referral code to join Selliox and get your first month FREE! OR, you'll be entered into our $1,000 monthly prize draw.";
    let shareLink = "";
    
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(shareLink, "_blank", "width=600,height=400");
        break;
      case "email":
        const emailSubject = "Join Selliox with my referral code - Get your first month FREE!";
        const emailBody = `Hi there,\n\nI wanted to share my Selliox referral code with you. Use code ${referralCode} when you sign up to get your first month FREE!\n\nOr you'll be entered into our $1,000 monthly prize draw.\n\nSign up here: ${shareUrl}\n\nThanks,\n${user?.name || "A friend"}`;
        
        shareLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
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
          // For desktop, show instructions
          // This is handled in the UI
        }
        break;
      default:
        break;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate total tickets
  const totalTickets = drawEntries.reduce((sum, entry) => sum + entry.tickets, 0);
  
  // Get upcoming draw
  const upcomingDraw = monthlyDraws.find(draw => draw.status === "upcoming");



  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Referral Dashboard</h1>
        
        {/* Demo component for testing referral notifications */}
        <ReferralNotificationDemo />
        
        {/* Referral Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaTicketAlt className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{totalTickets}</h2>
                <p className="text-sm text-gray-600">Total Tickets</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <FaUserPlus className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{drawEntries.length}</h2>
                <p className="text-sm text-gray-600">Referrals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <FaTrophy className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">${upcomingDraw ? upcomingDraw.prize.split(' ')[0] : '1,000'}</h2>
                <p className="text-sm text-gray-600">Prize Pool</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How It Works Section - Horizontal */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primaryA0 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">1</div>
              <h3 className="font-medium text-gray-800 mb-2">Share Your Code</h3>
              <p className="text-gray-600 text-sm">Share your unique referral code with friends and colleagues</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primaryA0 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">2</div>
              <h3 className="font-medium text-gray-800 mb-2">Earn Tickets</h3>
              <p className="text-gray-600 text-sm">Get 1 ticket when they sign up and 5 tickets when they create a listing</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primaryA0 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
              <h3 className="font-medium text-gray-800 mb-2">Win Prizes</h3>
              <p className="text-gray-600 text-sm">Enter the monthly draw for a chance to win a $1,000 prize</p>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("entries")}
                className={`flex-1 px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium ${activeTab === "entries" ? "text-primaryA0 border-b-2 border-primaryA0" : "text-gray-500 hover:text-gray-700"}`}
                disabled={!user}
              >
                <span className="flex flex-col sm:flex-row items-center justify-center gap-1">
                  <FaTicketAlt className="h-4 w-4" />
                  <span>Draw Entries</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("draws")}
                className={`flex-1 px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium ${activeTab === "draws" ? "text-primaryA0 border-b-2 border-primaryA0" : "text-gray-500 hover:text-gray-700"}`}
              >
                <span className="flex flex-col sm:flex-row items-center justify-center gap-1">
                  <FaTrophy className="h-4 w-4" />
                  <span>Monthly Draws</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("share")}
                className={`flex-1 px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium ${activeTab === "share" ? "text-primaryA0 border-b-2 border-primaryA0" : "text-gray-500 hover:text-gray-700"}`}
                disabled={!user}
              >
                <span className="flex flex-col sm:flex-row items-center justify-center gap-1">
                  <FaShare className="h-4 w-4" />
                  <span>Share & Earn</span>
                </span>
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-4 sm:p-6 mb-8">
          {/* Draw Entries Tab */}
          {activeTab === "entries" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">My Draw Entries</h2>
                <div className="text-sm text-gray-500">
                  Total Tickets: <span className="font-medium">{totalTickets}</span>
                </div>
              </div>
              
              {drawEntries.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tickets
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {drawEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-primaryA0 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                {entry.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3 sm:ml-4">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{entry.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {entry.action === "signup" ? "Sign Up" : "Listing Created"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaTicketAlt className="text-primaryA0 mr-2" size={14} />
                              <span>{entry.tickets}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaTicketAlt className="mx-auto text-gray-300 text-4xl mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Entries Yet</h3>
                  <p className="text-gray-600">Share your referral code to start earning tickets</p>
                </div>
              )}
            </div>
          )}
          
          {/* Monthly Draws Tab */}
          {activeTab === "draws" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Prize Draw</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <FaTrophy className="text-yellow-500 text-2xl mr-3" />
                      <h3 className="text-xl font-bold text-gray-800">$1,000 Prize Pool</h3>
                    </div>
                    <p className="text-gray-600 mt-2">Win a Premium Listing Package worth $1,000</p>
                    <p className="text-sm text-gray-500 mt-1">Every ticket increases your chances of winning</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Next Draw In</h4>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="bg-primaryA0 text-white text-xl font-bold w-12 h-12 rounded-md flex items-center justify-center">9</div>
                        <span className="text-xs mt-1">Days</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-primaryA0 text-white text-xl font-bold w-12 h-12 rounded-md flex items-center justify-center">14</div>
                        <span className="text-xs mt-1">Hours</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-primaryA0 text-white text-xl font-bold w-12 h-12 rounded-md flex items-center justify-center">32</div>
                        <span className="text-xs mt-1">Minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-green-200">
                  <h4 className="font-medium text-gray-800 mb-2">How the Draw Works</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>The draw takes place on the last day of each month</li>
                    <li>Each ticket gives you one entry into the draw</li>
                    <li>The more tickets you have, the better your chances</li>
                    <li>Winners are notified by email and announced on the platform</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Share Tab */}
          {activeTab === "share" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Share Your Referral Code</h2>
              
              {/* Referral Code Display */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Unique Referral Code</label>
                <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-300">
                  <div className="font-medium text-gray-800 text-lg">{referralCode}</div>
                  <button 
                    onClick={handleCopyReferralCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors"
                  >
                    <FaCopy size={14} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              
              {/* Referral Link Display */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
                <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-300">
                  <div className="font-medium text-gray-800 text-sm truncate max-w-xs">{shareUrl}</div>
                  <button 
                    onClick={handleCopyReferralLink}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors ml-2 flex-shrink-0"
                  >
                    <FaCopy size={14} />
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
              
              {/* Share Options */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Share via</h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
                  <button 
                    onClick={() => handleShare("facebook")} 
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${shareMethod === "facebook" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <FaFacebook className={shareMethod === "facebook" ? "text-white" : "text-blue-600"} />
                    <span>Facebook</span>
                  </button>
                  <button 
                    onClick={() => handleShare("email")} 
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${shareMethod === "email" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <FaEnvelope className={shareMethod === "email" ? "text-white" : "text-red-500"} />
                    <span>Email</span>
                  </button>
                  <button 
                    onClick={() => handleShare("whatsapp")} 
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${shareMethod === "whatsapp" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <FaWhatsapp className={shareMethod === "whatsapp" ? "text-white" : "text-green-500"} />
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => handleShare("sms")} 
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${shareMethod === "sms" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <FaSms className={shareMethod === "sms" ? "text-white" : "text-blue-500"} />
                    <span>Text</span>
                  </button>
                </div>
              </div>
              
              {/* Share Method Instructions */}
              {shareMethod && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-md font-medium text-blue-800 mb-2">
                    Sharing via {shareMethod.charAt(0).toUpperCase() + shareMethod.slice(1)}
                  </h3>
                  
                  {shareMethod === "facebook" && (
                    <div className="space-y-2 text-sm text-blue-700">
                      <p>1. A Facebook sharing window will open</p>
                      <p>2. You can add a personal message before posting</p>
                      <p>3. Click "Post to Facebook" to share with your network</p>
                      <p>4. Your friends will see your post with your referral link</p>
                    </div>
                  )}
                  
                  {shareMethod === "email" && (
                    <div className="space-y-2 text-sm text-blue-700">
                      <p>1. Click the Email share button above</p>
                      <p>2. Your default email client will open</p>
                      <p>3. Enter your friend's email address</p>
                      <p>4. The subject and message are pre-filled</p>
                      <p>5. Click "Send" to share your referral code</p>
                    </div>
                  )}
                  
                  {shareMethod === "whatsapp" && (
                    <div className="space-y-2 text-sm text-blue-700">
                      <p>1. Click the WhatsApp share button above</p>
                      <p>2. WhatsApp will open (web or app)</p>
                      <p>3. Select a contact to send to</p>
                      <p>4. The message with your referral code is pre-filled</p>
                      <p>5. Click "Send" to share your referral code</p>
                    </div>
                  )}
                  
                  {shareMethod === "sms" && (
                    <div className="space-y-2 text-sm text-blue-700">
                      {/Android|iPhone/i.test(navigator.userAgent) ? (
                        <>
                          <p>1. Your messaging app will open</p>
                          <p>2. Enter the recipient's phone number</p>
                          <p>3. The message with your referral link is pre-filled</p>
                          <p>4. Tap "Send" to share your referral code</p>
                        </>
                      ) : (
                        <>
                          <p>1. On your mobile device, open your messaging app</p>
                          <p>2. Create a new message to your friend</p>
                          <p>3. Copy and paste this text:</p>
                          <div className="bg-white p-2 rounded border border-blue-200 text-gray-800 mt-1">
                            Hey! Use my referral code to join Selliox and get your first month FREE! OR, you'll be entered into our $1,000 monthly prize draw. Use code: {referralCode} {shareUrl}
                          </div>
                          <p>4. Tap "Send" to share your referral code</p>
                        </>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => setShareMethod(null)}
                    className="text-blue-700 text-sm font-medium mt-3 hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
              
              {/* Ticket Earning Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium text-gray-800 mb-3">Earn Tickets</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                      <FaUserPlus className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">1 Ticket</p>
                      <p className="text-sm text-gray-600">When someone signs up using your code</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-3">
                      <FaListUl className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">5 Tickets</p>
                      <p className="text-sm text-gray-600">When they create a listing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full mr-3">
                      <FaTrophy className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Monthly Prize Draw</p>
                      <p className="text-sm text-gray-600">Each ticket gives you a chance to win the $1,000 prize</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboardPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaTimes, FaTicketAlt, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setReferralNotifications } from '../../redux/slices/notifications.slice';

export default function ReferralNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector(state => state.notifications.referralNotifications || []);
  const count = notifications.length;
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/referral/notifications');
      dispatch(setReferralNotifications(response.data.notifications || []));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      dispatch(setReferralNotifications([]));
    }
  };
  
  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.post(`/referral/notifications/read/${notificationId}`);
      // Update local state
      dispatch(setReferralNotifications(
        notifications.filter(n => n._id !== notificationId)
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await axiosInstance.post('/referral/notifications/read-all');
      dispatch(setReferralNotifications([]));
      setIsOpen(false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const renderNotificationContent = (notification) => {
    const { type, data } = notification;
    
    switch(type) {
      case 'referral_used':
        return (
          <div>
            <p className="font-medium">Someone used your referral code!</p>
            <p className="text-sm text-gray-600">
              You can claim a free month or 5 draw entries.
            </p>
            <div className="mt-2">
              <Link 
                to="/referral" 
                className="text-primaryA0 hover:underline text-sm"
                onClick={() => {
                  markAsRead(notification._id);
                  setIsOpen(false);
                }}
              >
                Claim your reward
              </Link>
            </div>
          </div>
        );
        
      case 'draw_entry':
        return (
          <div className="flex">
            <FaTicketAlt className="text-primaryA0 text-xl mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">New draw entries added!</p>
              <p className="text-sm text-gray-600">
                You received {data?.tickets || 5} new draw entries.
              </p>
              <div className="mt-2">
                <Link 
                  to="/referral" 
                  className="text-primaryA0 hover:underline text-sm"
                  onClick={() => {
                    markAsRead(notification._id);
                    setIsOpen(false);
                  }}
                >
                  View your entries
                </Link>
              </div>
            </div>
          </div>
        );
        
      case 'draw_winner':
        return (
          <div className="flex">
            <FaTrophy className="text-yellow-500 text-xl mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Congratulations! You've won the draw!</p>
              <p className="text-sm text-gray-600">
                You've won ${data?.amount || 1000} in our monthly draw.
              </p>
              <div className="mt-2">
                <Link 
                  to="/referral/claim-prize" 
                  className="text-primaryA0 hover:underline text-sm"
                  onClick={() => {
                    markAsRead(notification._id);
                    setIsOpen(false);
                  }}
                >
                  Claim your prize
                </Link>
              </div>
            </div>
          </div>
        );
        
      case 'draw_reminder':
        return (
          <div className="flex">
            <FaCalendarAlt className="text-primaryA0 text-xl mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Draw is tomorrow!</p>
              <p className="text-sm text-gray-600">
                The monthly $1,000 draw will take place tomorrow.
              </p>
              <div className="mt-2">
                <Link 
                  to="/referral" 
                  className="text-primaryA0 hover:underline text-sm"
                  onClick={() => {
                    markAsRead(notification._id);
                    setIsOpen(false);
                  }}
                >
                  View your entries
                </Link>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <p className="text-sm">{notification.message || "New notification received."}</p>
        );
    }
  };
  
  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-600 hover:text-primaryA0 transition-colors"
        onClick={toggleDropdown}
        aria-label="Referral notifications"
      >
        <FaBell size={20} />
        {count > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full flex justify-center items-center w-5 h-5">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Referral Notifications</h3>
            <div className="flex gap-2">
              {count > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-gray-500 hover:text-primaryA0"
                >
                  Mark all as read
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {count === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-gray-500">
                <FaBell className="text-gray-300 text-3xl mb-2" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map(notification => (
                  <div 
                    key={notification._id} 
                    className="p-4 border-b hover:bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <div className="flex-grow mr-4">
                        {renderNotificationContent(notification)}
                      </div>
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="text-gray-400 hover:text-gray-600 self-start"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t bg-gray-50 text-center">
            <Link 
              to="/referral" 
              className="text-primaryA0 hover:underline text-sm"
              onClick={() => setIsOpen(false)}
            >
              View Referral Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import ReferralToast from '../Components/ReferralNotification/ReferralToast';

// Create context
const ReferralNotificationContext = createContext();

// Custom hook to use the context
export const useReferralNotifications = () => {
  return useContext(ReferralNotificationContext);
};

export const ReferralNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Add a new notification
  const addNotification = (referral) => {
    // Generate a unique ID for this notification
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...referral, id }]);
  };
  
  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Mock function to simulate receiving a referral notification
  // In a real implementation, this would be connected to WebSockets or server-sent events
  const simulateReferralNotification = (type = 'signup') => {
    addNotification({
      type, // 'signup' or 'listing'
      timestamp: new Date(),
    });
  };
  
  // Value to be provided by the context
  const value = {
    addNotification,
    removeNotification,
    simulateReferralNotification
  };
  
  return (
    <ReferralNotificationContext.Provider value={value}>
      {children}
      
      {/* Render all active notifications */}
      {notifications.map((notification) => (
        <ReferralToast
          key={notification.id}
          referral={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </ReferralNotificationContext.Provider>
  );
};

export default ReferralNotificationProvider;

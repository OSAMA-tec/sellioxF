import React from 'react';
import { useReferralNotifications } from '../../context/ReferralNotificationContext';
import { FaUserPlus, FaStore } from 'react-icons/fa';

const ReferralNotificationDemo = () => {
  const { simulateReferralNotification } = useReferralNotifications();

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Test Referral Notifications</h3>
      <p className="text-xs text-gray-500 mb-3">
        Click the buttons below to simulate receiving referral notifications.
        In a real implementation, these would be triggered by the backend.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => simulateReferralNotification('signup')}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          <FaUserPlus />
          <span>Signup (1 Ticket)</span>
        </button>
        <button
          onClick={() => simulateReferralNotification('listing')}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
        >
          <FaStore />
          <span>Listing (5 Tickets)</span>
        </button>
      </div>
    </div>
  );
};

export default ReferralNotificationDemo;

import React, { useEffect, useState } from 'react';
import { FaGift, FaTicketAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './ReferralNotification.css';

const ReferralToast = ({ referral, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 8 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow exit animation to complete
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle manual close
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Allow exit animation to complete
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-primaryA0/20 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primaryA0/10 p-2 rounded-full">
                {referral.type === 'signup' ? (
                  <FaGift className="h-6 w-6 text-primaryA0" />
                ) : (
                  <FaTicketAlt className="h-6 w-6 text-primaryA0" />
                )}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New Referral!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {referral.type === 'signup' ? (
                    <>Someone just signed up using your referral code! You've earned 1 ticket for the $1,000 monthly draw.</>
                  ) : (
                    <>Someone just created a listing using your referral code! You've earned 5 tickets for the $1,000 monthly draw.</>
                  )}
                </p>
                <div className="mt-2 flex">
                  <button
                    onClick={() => window.location.href = '/referral-dashboard'}
                    className="text-sm text-primaryA0 font-medium hover:text-primaryA0/80"
                  >
                    View Referral Dashboard
                  </button>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-primaryA0 h-1 animate-progress"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReferralToast;

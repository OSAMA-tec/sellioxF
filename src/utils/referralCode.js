/**
 * Utility functions for handling referral codes
 */

/**
 * Gets the user's referral code from localStorage or generates a new one if it doesn't exist
 * @param {Object} user - The user object from Redux state
 * @returns {string} The user's referral code
 */
export const getUserReferralCode = (user) => {
  if (!user) return null;
  
  // Check if the user already has a referral code stored in localStorage
  const storedCode = localStorage.getItem('userReferralCode');
  
  if (storedCode) {
    return storedCode;
  }
  
  // Generate a new referral code based on user ID and username
  // Format: REF-[first 3 chars of username]-[last 4 digits of user ID]
  let newCode = '';
  
  if (user.username) {
    // Take first 3 characters of username (uppercase)
    const usernamePrefix = user.username.substring(0, 3).toUpperCase();
    
    // Take last 4 digits of user ID or generate random if not available
    const idSuffix = user.id 
      ? user.id.toString().slice(-4) 
      : Math.floor(1000 + Math.random() * 9000).toString();
    
    newCode = `REF-${usernamePrefix}-${idSuffix}`;
  } else {
    // Fallback if no username is available
    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    newCode = `REF-${randomSuffix}`;
  }
  
  // Store the new code in localStorage for persistence
  localStorage.setItem('userReferralCode', newCode);
  
  return newCode;
};

/**
 * Creates a referral URL with the user's referral code
 * @param {string} referralCode - The user's referral code
 * @returns {string} The full referral URL
 */
export const createReferralUrl = (referralCode) => {
  if (!referralCode) return '';
  
  const baseUrl = window.location.origin;
  return `${baseUrl}/auth/register?ref=${referralCode}`;
};

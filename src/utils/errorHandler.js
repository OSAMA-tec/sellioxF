import { toast } from 'react-toastify';

/**
 * Centralized error handler for the application
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {object} options - Additional options for error handling
 * @returns {void}
 */
export const handleError = (error, context = 'Application', options = {}) => {
  const {
    showToast = true,
    logToConsole = process.env.NODE_ENV !== 'production',
    fallbackMessage = 'An unexpected error occurred',
    onError = null,
  } = options;
  
  // Get a readable error message
  let errorMessage = fallbackMessage;
  
  if (error?.response?.data?.message) {
    // Server error with message
    errorMessage = error.response.data.message;
  } else if (error?.message) {
    // Standard error object with message
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // Error is already a string
    errorMessage = error;
  }
  
  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }
  
  // Log to console in non-production environments
  if (logToConsole) {
    console.error(`Error in ${context}:`, error);
  }
  
  // Call custom error handler if provided
  if (typeof onError === 'function') {
    onError(error, errorMessage);
  }
  
  return errorMessage;
};

/**
 * React Query error handler
 * @param {Error} error - The error object from React Query
 * @param {string} context - Context where the error occurred
 * @returns {void}
 */
export const queryErrorHandler = (error, context) => {
  return handleError(error, `Query (${context})`, {
    showToast: true
  });
};

/**
 * Mutation error handler
 * @param {Error} error - The error object from React Query mutation
 * @param {string} context - Context where the error occurred
 * @returns {void}
 */
export const mutationErrorHandler = (error, context) => {
  return handleError(error, `Mutation (${context})`, {
    showToast: true
  });
};

export default {
  handleError,
  queryErrorHandler,
  mutationErrorHandler
}; 
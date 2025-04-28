import axiosInstance from "../../axiosInstance/axiosInstance";
import { useQuery } from "react-query";

/**
 * Fetches all categories from the API
 * @returns {Promise} API response containing categories
 */
const getCategories = async () => {
  const response = await axiosInstance.get("/category/all");
  return response;
};

/**
 * Hook to get all categories for menus, filters, etc.
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Success callback function
 * @param {Function} options.onError - Error callback function
 * @param {Boolean} options.enabled - Whether the query is enabled (defaults to true)
 * @returns {Object} Query result with data, loading state, etc.
 */
const useGetAllCategories = (options = {}) => {
  const { onSuccess, onError, enabled = true } = options;

  return useQuery(["category", "all"], getCategories, {
    onSuccess,
    onError,
    enabled,
    // Cache categories for 1 hour as they don't change often
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    // Retry 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Transform the response to directly access categories
    select: (data) => {
      return {
        data: {
          categories: data?.data?.categories || [],
          success: data?.data?.success || false,
        },
      };
    },
  });
};

export default useGetAllCategories;

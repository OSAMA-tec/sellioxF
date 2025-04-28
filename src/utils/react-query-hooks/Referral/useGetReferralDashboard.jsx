import { useQuery } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

// ============ FETCH REFERRAL DASHBOARD DATA ============
/**
 * Gets the user's referral dashboard data from the API
 * Returns user details, referral code, statistics, and draw entries
 */
const getReferralDashboard = async () => {
  const response = await axiosInstance.get("/referral/dashboard");
  return response.data;
};

/**
 * Hook to get user's referral dashboard data
 * @param {Function} onSuccess - Callback for successful data fetch
 * @param {Function} onError - Callback for error during fetch
 * @returns {Object} Query result object with data, loading and error states
 */
const useGetReferralDashboard = (onSuccess, onError) => {
  return useQuery(["referralDashboard"], getReferralDashboard, {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    // Cache data for 5 minutes
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export default useGetReferralDashboard;

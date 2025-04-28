import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

// ============ REFERRAL ACTIONS ============
/**
 * Performs an action related to referrals
 * @param {Object} data - Action data including type and any additional parameters
 * @returns {Promise} API response
 */
const performReferralAction = async (data) => {
  const { actionType, ...actionData } = data;
  const response = await axiosInstance.post(`/referral/${actionType}`, actionData);
  return response.data;
};

/**
 * Hook for performing referral actions like claiming rewards
 * @param {Function} onSuccess - Callback for successful action
 * @param {Function} onError - Callback for error during action
 * @returns {Object} Mutation object with execute function
 */
const useReferralAction = (onSuccess, onError) => {
  const queryClient = useQueryClient();

  return useMutation(performReferralAction, {
    onSuccess: (data, variables) => {
      // Invalidate referral dashboard data to trigger a refresh
      queryClient.invalidateQueries(["referralDashboard"]);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
    },
  });
};

export default useReferralAction;

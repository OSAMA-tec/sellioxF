import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const updateListingPlan = (listingId, planData) => {
  return axiosInstance.put(`/listing/${listingId}/plan`, planData);
};

const useUpdateListingPlan = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ listingId, planData }) => updateListingPlan(listingId, planData),
    {
      onSuccess: (data) => {
        // Invalidate and refetch listings queries
        queryClient.invalidateQueries(['listings', 'user']);
        queryClient.invalidateQueries(['listing', data.data.listing._id]);
        
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error);
        }
      }
    }
  );
};

export default useUpdateListingPlan; 
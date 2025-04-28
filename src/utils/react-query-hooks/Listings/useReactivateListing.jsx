import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const reactivateListing = (listingId, planData) => {
  return axiosInstance.put(`/listing/${listingId}/reactivate`, planData);
};

const useReactivateListing = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ listingId, planData }) => reactivateListing(listingId, planData),
    {
      onSuccess: (data) => {
        // Invalidate and refetch listings queries
        queryClient.invalidateQueries(['listings', 'user']);
        
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

export default useReactivateListing; 
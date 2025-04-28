import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const deactivateListing = (listingId) => {
  return axiosInstance.put(`/listing/${listingId}/deactivate`);
};

const useDeactivateListing = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (listingId) => deactivateListing(listingId),
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

export default useDeactivateListing; 
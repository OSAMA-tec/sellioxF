import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const updateListing = (listingId, formData) => {
  return axiosInstance.put(`/listing/${listingId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const useUpdateListing = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ listingId, formData }) => updateListing(listingId, formData),
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

export default useUpdateListing; 
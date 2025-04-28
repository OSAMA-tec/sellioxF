import { useMutation } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const removeSavedListing = (listingId)=>{ 
    return axiosInstance.delete(`/listing/saved/delete/${listingId}`);
}

const useRemoveSavedListing = ({onSuccess,onError})=>{
return useMutation(removeSavedListing,
    {
        onSuccess,
        onError
    }
)
};

export default useRemoveSavedListing;
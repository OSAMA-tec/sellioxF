import { useMutation } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const saveListing = (listingId)=>{  
    // Updated to match the correct backend endpoint structure
    return axiosInstance.post(`/listing/saved/${listingId}`);
}

const useSaveListing = ({onSuccess,onError})=>{
return useMutation(saveListing,
    {
        onSuccess,
        onError
    }
)
};

export default useSaveListing;
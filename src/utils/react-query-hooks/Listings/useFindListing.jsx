import {useQuery } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const findListing = (listingId)=>{
    return axiosInstance.get(`/listing/find/${listingId}`);
};


const useFindListing = (listingId,onSuccess,onError)=>{
    return useQuery(
        ["listings-find",listingId],
        ()=>findListing(listingId),
        {
            onSuccess,
            onError
        }
    )
};

export default useFindListing;

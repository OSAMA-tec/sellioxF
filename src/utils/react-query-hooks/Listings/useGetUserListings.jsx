import {useQuery } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const getUserListings = ({page=1,limit=10})=>{
    return axiosInstance.get(`/listing/mylistings?page=${page}&limit=${limit}`);
};

const useGetUserListings = ({page=1,limit=10,onSuccess,onError,status})=>{
    let url = `/listing/mylistings?page=${page}&limit=${limit}`;
    if (status) {
        url += `&status=${status}`;
    }
    
    return useQuery(
        ["listings","user",{page,limit,status}],
        ()=> axiosInstance.get(url),
        {
            onSuccess,
            onError
        }
    )
};

export default useGetUserListings;
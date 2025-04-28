import axiosInstance from "../../axiosInstance/axiosInstance";
import { useMutation } from "react-query";

const getClientSecret = async(data)=>{
    console.log(data);
    
    return axiosInstance.post(`/payment/check-out`,data)
}


const useCheckOut = (onSuccess,onError)=>{
    return useMutation(getClientSecret,{
        onSuccess,
        onError
    })
};

export default useCheckOut;
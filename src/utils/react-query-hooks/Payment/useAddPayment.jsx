import axios from "axios";
import axiosInstance from "../../axiosInstance/axiosInstance";
import {useMutation} from "react-query";
import config from "../../../config";
const addPayment = (payment)=>{
    console.log(payment);
    
    return axiosInstance.post(`${config.BACKEND_URL}/api/v1/credit/create`,payment)
};


const useAddPayment = (onSuccess , onError)=>{
    return useMutation(
        addPayment,{
            onSuccess,
            onError
        }
    )
}

export default useAddPayment;
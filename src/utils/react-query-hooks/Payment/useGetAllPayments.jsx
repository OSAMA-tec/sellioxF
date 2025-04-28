import { useQuery } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";
import config from "../../../config";
const getCredits = ()=>{
    return axiosInstance.get(`${config.BACKEND_URL}/api/v1/credit/all`);
}

const useGetAllPayments = (onSuccess,onError)=>{
    return useQuery(
        ["allCredits"],
        getCredits,
        {
            onSuccess,
            onError
        }
    )
}

export default useGetAllPayments;
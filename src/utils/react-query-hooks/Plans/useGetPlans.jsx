import axiosInstance from "../../axiosInstance/axiosInstance";
import { useQuery } from "react-query";

const getPlans = ()=>{
    return axiosInstance.get("/plan/all");
}

const useGetPlans = (onSuccess,onError)=>{
    return useQuery(
        ["all-plans"],
        getPlans,
        {
            onSuccess,
            onError
        }
    )
};

export default useGetPlans;
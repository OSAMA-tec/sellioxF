import { useMutation } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const addReview = (review)=>{  
    return axiosInstance.post("/review/create",review);
}

const useAddReview = ({onSuccess,onError})=>{
return useMutation(addReview,
    {
        onSuccess,
        onError
    }
)
};

export default useAddReview;
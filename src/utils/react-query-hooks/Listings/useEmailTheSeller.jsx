import { useMutation } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const emailTheSeller = (email)=>{  
    return axiosInstance.post("/email/send",email);
}

const useEmailTheSeller = ({onSuccess,onError})=>{
return useMutation(emailTheSeller,
    {
        onSuccess,
        onError
    }
)
};

export default useEmailTheSeller;
import { useMutation } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const updateUser = (updatedData)=>{  
    return axiosInstance.put("/auth/update",updatedData);
}

const useUpdateUser = ({onSuccess, onError })=>{
    return useMutation(
        updateUser,
        {
            onSuccess,
            onError
        }
    )
};

export default useUpdateUser;
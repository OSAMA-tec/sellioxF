import axios from "axios";
import {useMutation} from "react-query";
import config from "../../../config";

const loginUser = (user)=>{
    return axios.post(`${config.BACKEND_URL}/api/v1/auth/login`,user)
};


const useLoginUser = (onSuccess , onError)=>{
    return useMutation(
        loginUser,{
            onSuccess,
            onError
        }
    )
}

export default useLoginUser;
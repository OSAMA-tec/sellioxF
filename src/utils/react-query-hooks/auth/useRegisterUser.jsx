import axios from "axios";
import {useMutation} from "react-query";
import config from "../../../config";

const registerUser = (userData) => {
    // Extract only the fields we need
    const { fullName, username, email, password, referralCode, hasValidReferral } = userData;
    
    // Create a clean user object with only the required fields
    const user = {
        fullName,
        username,
        email,
        password
    };
    
    // Only add referral code if it exists
    if (referralCode) {
        user.referralCode = referralCode;
        user.hasValidReferral = hasValidReferral || false;
    }
    
    return axios.post(`${config.BACKEND_URL}/api/v1/auth/register`, user);
};


const useRegisterUser = (onSuccess , onError)=>{
    return useMutation(
        registerUser,{
            onSuccess,
            onError
        }
    )
}

export default useRegisterUser;
import axios from "axios";
import config from "../../config";

const axiosInstance = axios.create({
    baseURL: config.BACKEND_URL + "/api/v1"
});

// Function to get user from localStorage
const getUser = () => {
    return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
};

//axios request interceptor to put the token inside every request
axiosInstance.interceptors.request.use(async (req) => {
    const user = getUser();
    if (user && user.token) {
        req.headers.Authorization = `Bearer ${user.token}`
    }
    return req;
})
/* 
//axios response interceptor for dealing with if the token we sent was expired or invalid
axiosInstance.interceptors.response.use(
    res =>res,
    async(error)=>{
        
        const originalRequest = error.config;
        console.log(error);
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try{      
                const user = getUser();   
                const refreshToken = user.refreshToken;
                const response = await axios.post(`${baseURL}/auth/refresh`,{refreshToken});
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                const newUser = {name:user.name,accessToken:newAccessToken,refreshToken:newRefreshToken};
                localStorage.setItem("user",JSON.stringify(newUser));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axiosInstance(originalRequest);

            }catch(refreshError){
                console.log("deleting user", refreshError);
                
                localStorage.removeItem("user");
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }

) */




export default axiosInstance;
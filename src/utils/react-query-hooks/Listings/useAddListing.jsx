import axiosInstance from "../../axiosInstance/axiosInstance";
import { useMutation } from "react-query";

const addList = async(data)=>{
    console.log("addlist",data);
    const formData = new FormData();
    if (data.logo) {
        formData.append('logo', data.logo); // Assuming data.logo is an array (e.g., from a file input)
    }

    // Append serviceImages (multiple files)
    if (data.serviceImages && data.serviceImages.length > 0) {
        data.serviceImages.forEach((image) => {
            formData.append('serviceImages', image); // Or `serviceImages[]` if your backend expects that
        });
    }
    // Append all user fields to the FormData
    Object.keys(data).forEach((key) => {
        if (key !== 'serviceImages' && key !== "logo") {
            formData.append(key, data[key]);
          }
    });
    try {
        const response = await axiosInstance.post("/listing/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const useAddListing = (onSuccess,onError)=>{
    return useMutation(addList,
        {
            onSuccess,
            onError
        }
    )
};


export default useAddListing;
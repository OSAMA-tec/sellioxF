import axiosInstance from "../../axiosInstance/axiosInstance";
import { useMutation } from "react-query";

const addList = async (data) => {
  console.log("addlist", data);
  const formData = new FormData();

  // Process logo file
  if (data.logo) {
    formData.append("logo", data.logo);
  }

  // ============ ENSURE SERVICEIMAGES IS ALWAYS AN ARRAY ============
  // Safely handle serviceImages (ensure it's always an array)
  const serviceImages = Array.isArray(data.serviceImages) ? data.serviceImages : data.serviceImages ? [data.serviceImages] : [];

  // Process photos array if it exists and serviceImages is empty
  // Photos component stores images in "photos" array
  if (serviceImages.length === 0 && data.photos && Array.isArray(data.photos)) {
    data.photos.forEach((photoObj) => {
      if (photoObj && photoObj.file) {
        formData.append("serviceImages", photoObj.file);
      }
    });
  } else {
    // Append serviceImages (multiple files)
    if (serviceImages.length > 0) {
      serviceImages.forEach((image) => {
        // Handle both File objects and objects with file property
        const fileToAppend = image.file ? image.file : image;

        // Extra safety check to ensure each image is valid
        if (fileToAppend) {
          formData.append("serviceImages", fileToAppend);
        }
      });
    }
  }

  // ============ HANDLE OTHER FORM DATA ============
  // Append all other fields to the FormData
  Object.keys(data).forEach((key) => {
    // Skip file fields that we've already processed
    if (key !== "serviceImages" && key !== "logo" && key !== "photos") {
      // Handle arrays properly with [] notation for backend compatibility
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  // Submit the form data to the API
  const response = await axiosInstance.post("/listing/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const useAddListing = (onSuccess, onError) => {
  return useMutation(addList, {
    onSuccess,
    onError,
  });
};

export default useAddListing;

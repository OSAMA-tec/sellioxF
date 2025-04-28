import { useMutation } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

// API endpoints
const updateUser = (updatedData) => {
  return axiosInstance.put("/auth/update", updatedData);
};

// Check password endpoint
const checkPassword = (currentPassword) => {
  return axiosInstance.post("/auth/check-password", { currentPassword });
};

// Custom hook for checking password validity
export const useCheckPassword = (onSuccess, onError) => {
  return useMutation(checkPassword, {
    onSuccess,
    onError,
  });
};

// Custom hook for updating user information
const useUpdateUser = (onSuccess, onError) => {
  return useMutation(updateUser, {
    onSuccess,
    onError,
  });
};

export default useUpdateUser;

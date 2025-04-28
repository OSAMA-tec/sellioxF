import axiosInstance from "../../axiosInstance/axiosInstance";
import { useMutation } from "react-query";

// Function to create a payment intent
const createPaymentIntent = async (data) => {
  // Expects data with planId
  return axiosInstance.post(`/plan-user/create-intent`, data);
};

const useCreatePaymentIntent = (onSuccess, onError) => {
  return useMutation(createPaymentIntent, {
    onSuccess,
    onError,
  });
};

export default useCreatePaymentIntent;

import axiosInstance from "../../axiosInstance/axiosInstance";
import { useMutation } from "react-query";

// Function to confirm payment on the server after Stripe verification
const confirmPayment = async (data) => {
  // Expects data with paymentIntentId
  return axiosInstance.post(`/plan-user/confirm-payment`, data);
};

const useConfirmPayment = (onSuccess, onError) => {
  return useMutation(confirmPayment, {
    onSuccess,
    onError,
  });
};

export default useConfirmPayment;

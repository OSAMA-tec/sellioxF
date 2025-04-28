import axiosInstance from "../../axiosInstance/axiosInstance";
import { useQuery } from "react-query";

const getUserSubscriptions = () => {
  return axiosInstance.get("/plan-user/my-subscriptions");
};

const useGetUserSubscriptions = (onSuccess, onError) => {
  return useQuery(["user-subscriptions"], getUserSubscriptions, {
    onSuccess,
    onError,
    // Don't refetch on window focus as subscriptions don't change often
    refetchOnWindowFocus: false,
  });
};

export default useGetUserSubscriptions;

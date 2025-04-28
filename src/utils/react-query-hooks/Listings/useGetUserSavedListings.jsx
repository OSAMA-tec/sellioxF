import { useQuery } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";

const userSavedListings = ({ page = 1, limit = 10 }) => {
  return axiosInstance.get(`/listing/saved/find?limit=${limit}&page=${page}`);
};

const useGetUserSavedListings = ({ page = 1, limit = 10, onSuccess, onError }) => {
  return useQuery(["listings", "saved", { page, limit }], () => userSavedListings({ page, limit }), {
    onSuccess,
    onError,
  });
};

export default useGetUserSavedListings;

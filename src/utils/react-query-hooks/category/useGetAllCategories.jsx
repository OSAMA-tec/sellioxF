import axiosInstance from "../../axiosInstance/axiosInstance";
import { useQuery } from "react-query";

const getCategories = () => {
  return axiosInstance.get("/category/all");
};

const useGetAllCategories = ({ onSuccess, onError }) => {
  return useQuery(["category", "all"], getCategories, {
    onSuccess,
    onError,
  });
};

export default useGetAllCategories;

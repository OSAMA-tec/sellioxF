import {useQuery } from "react-query";
import axiosInstance from "../../axiosInstance/axiosInstance";


const getAllListings = ({page=1, limit=10, category="", title="", subCategory="", country="", region="", district="", listingNumber=""}) => {  
    return axiosInstance.get(`/listing/all?limit=${limit}&page=${page}&category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}&subCategory=${encodeURIComponent(subCategory)}&country=${country}&region=${region}&district=${district}&listingNumber=${listingNumber}`);
};

const useGetAllListings = (
    {
        page=1,
        limit=10,
        onSuccess,
        onError,
        category,
        title,
        subCategory,
        country,
        region,
        district,
        listingNumber
    }) => {
    return useQuery(
        ["listings", "all", {page, limit, category, title, subCategory, country, region, district, listingNumber}],
        () => getAllListings({page, limit, category, title, subCategory, country, region, district, listingNumber}),
        {
            onSuccess,
            onError
        }
    )
};

export default useGetAllListings;
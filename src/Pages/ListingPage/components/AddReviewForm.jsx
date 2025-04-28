import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddRating from "../../../Components/Rating/AddRating";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reviewSchema } from "../../../utils/validations/ReviewSchema";
import useAddReview from "../../../utils/react-query-hooks/Listings/useAddReview";

export default function AddReviewForm({ isExpanded, handleExpanded, refetch }) {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //on success and on error functions for submitting the form
  const onSuccess = (response) => {
    console.log("res", response);
    setResponseMessage(response?.data?.message);
    refetch();
    setTimeout(handleExpanded, 2000);
  };
  const onError = (error) => {
    console.log("submit error", error);
    // Handle the error object properly to extract the message
    if (error?.response?.data) {
      if (typeof error.response.data === 'object') {
        // If it's an object, extract the message property
        setErrorMessage(error.response.data.message || 'An error occurred');
      } else {
        // If it's a string, use it directly
        setErrorMessage(error.response.data);
      }
    } else {
      setErrorMessage('Failed to submit review. Please try again.');
    }
  };

  const addReview = useAddReview({ onSuccess, onError });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(reviewSchema) });

  const onSubmit = (data) => {
    console.log("data submit ", data);
    setErrorMessage("");
    setResponseMessage("");
    const review = {
      ...data,
      listingId: id,
    };
    addReview.mutate(review);
  };

  return (
    <div className={`fixed w-screen h-screen inset-0 z-10  flex justify-center items-center ${!isExpanded ? "hidden " : ""} `}>
      <div className="w-full h-full absolute z-20 bg-black opacity-40" onClick={handleExpanded}></div>
      <div className={` bg-white shadow-2xl rounded-lg w-3/6 flex-col px-4 py-6 absolute  z-30 ${isExpanded ? "flex" : "hidden"}`}>
        <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="comment">Comment</label>
            <textarea {...register("comment")} id="comment" placeholder="Add Your Comment.." rows={4} className="border p-2 " />
          </div>
          <div className="flex flex-col gap-2">
            <p>What is Your Rating?</p>
            <AddRating rating={rating} setRating={setRating} setValue={setValue} />
          </div>
          <div>
            <button className="btn-primary" type="submit">
              Submit Review
            </button>
          </div>
        </form>
        {responseMessage && <p className="text-green-600 mt-4 p-2 bg-green-50 rounded-md">{responseMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4 p-2 bg-red-50 rounded-md">{errorMessage}</p>}
      </div>
    </div>
  );
}

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emailSchema } from '../../../utils/validations/emailSchema';
import { IoMdClose } from "react-icons/io";
import { useSelector } from 'react-redux'; 
import useEmailTheSeller from "../../../utils/react-query-hooks/Listings/useEmailTheSeller";
import useFindListing from "../../../utils/react-query-hooks/Listings/useFindListing.jsx";
import { useParams } from "react-router-dom";

export default function EmailSellerForm({isExpanded, handleExpanded, sellerId}) {
    const user = useSelector(state=>state.user.user);
    const { id } = useParams();
    const { data, isLoading, isError } = useFindListing(id);
    const listing = data?.data?.listing;
    
    // Make sure we have a valid seller ID
    const validSellerId = sellerId || listing?.sellerId;
    
    const [ responseMessage, setResponseMessage ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    
    //on success and on error functions for submitting the form
    const onSuccess = (response)=>{
        console.log("res",response);
        setIsSubmitting(false);
        setResponseMessage(response?.data?.message || "Message sent successfully!");
        setTimeout(() => {
            handleExpanded();
        }, 2000);
    }
    const onError = (error)=>{
        console.log("submit error" , error);
        setIsSubmitting(false);
        setErrorMessage(error?.response?.data?.message || "Failed to send message. Please try again.");
    }

    const sendEmail = useEmailTheSeller({onSuccess,onError});  
    const {register, handleSubmit, reset, formState:{errors}} = useForm({resolver:yupResolver(emailSchema)});
    
    const onSubmit = (data)=>{
        // Validate that we have a valid seller ID before submitting
        if (!validSellerId) {
            setErrorMessage("Unable to contact seller. Invalid seller information.");
            return;
        }
        
        console.log("data submit ", data);
        setIsSubmitting(true);
        
        const email = {
            sellerId: validSellerId,
            buyerEmail: user?.email,
            subject: `Message received for "${listing?.serviceTitle}"`,
            message: data.message
        }
        
        console.log(email);
        sendEmail.mutate(email);
        setErrorMessage("");
        setResponseMessage("");
    }
    
    return (
        <div className={`fixed w-screen h-screen inset-0 z-50 flex justify-center items-center ${!isExpanded? "hidden" :""}`}>
            {/* Dark overlay */}
            <div 
                className='w-full h-full absolute z-20 bg-black opacity-60' 
                onClick={handleExpanded}
            ></div>
            
            {/* Modal content */}
            <div className={`bg-white shadow-2xl rounded-lg w-[90%] sm:w-4/5 md:w-3/5 max-w-xl flex-col px-4 py-5 absolute z-30 max-h-[90vh] overflow-y-auto ${isExpanded?"flex":"hidden"}`}>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-primaryA0 border-t-transparent rounded-full"></div>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        <p>Unable to load listing information. Please try again later.</p>
                    </div>
                ) : (
                <form className='flex flex-col gap-5 capitalize' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex justify-between items-center border-b pb-2'>
                        <h2 className='text-xl md:text-2xl font-medium'>Message the seller</h2>
                        <button 
                            type="button"
                            onClick={handleExpanded} 
                            className='hover:cursor-pointer hover:bg-gray-100 p-2 rounded-full'
                        >
                            <IoMdClose size={22} />
                        </button>
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='message' className='font-medium'>Your message</label>
                        <textarea 
                            {...register("message")}
                            id='message'
                            placeholder='Enter your message...'
                            rows={4}
                            className='border p-2 rounded w-full focus:outline-primaryA0 focus:border-primaryA0'
                        />
                        {errors.message && <p className='text-red-500 text-sm'>{errors.message.message}</p>}
                    </div>
                    
                    <div className='mt-2'>
                        <button 
                            className='btn-primary w-full py-3 text-center rounded-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed' 
                            type='submit'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send message'}
                        </button>
                    </div>
                </form>
                )}
                
                {/* Response messages */}
                {responseMessage && (
                    <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mt-4 flex items-start'>
                        <p>{responseMessage}</p>
                    </div>
                )}
                
                {errorMessage && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 flex items-start'>
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

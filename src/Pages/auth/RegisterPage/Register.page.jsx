import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReferralNotifications } from "../../../context/ReferralNotificationContext";
import useRegisterUser from '../../../utils/react-query-hooks/auth/useRegisterUser';
import { useForm } from 'react-hook-form';
import { signupSchema } from '../../../utils/validations/userSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/slices/user.slice';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaUserTag, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { simulateReferralNotification } = useReferralNotifications();
    const [registerError, setRegisterError] = useState(null);
    const [hasListingData, setHasListingData] = useState(false);
    const [referralCodeValid, setReferralCodeValid] = useState(false);
    const [referralCodeChecking, setReferralCodeChecking] = useState(false);
    const [referralCodeMessage, setReferralCodeMessage] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const {register, handleSubmit, setValue, watch, formState:{errors}} = useForm({
        resolver: yupResolver(signupSchema)
    })

    
    // Check if user has incomplete listing data
    useEffect(() => {
        const listingData = localStorage.getItem('listingFormData');
        if (listingData) {
            setHasListingData(true);
        }
        
        // Check if there's a referral code in the URL
        const params = new URLSearchParams(location.search);
        const refCode = params.get('ref');
        if (refCode) {
            // Pre-fill the referral code field
            setValue('referralCode', refCode);
            validateReferralCode(refCode);
        }
    }, [location, setValue]);
    
    const onSuccess = (data)=>{
        // Store referral code status in local storage if valid
        if (referralCodeValid) {
            localStorage.setItem("hasNewReferralTicket", "true");
            
            // Simulate a notification for the referrer
            // In a real implementation, this would be handled by the backend
            // and sent to the referrer via WebSockets or server-sent events
            // This is just for demonstration purposes
            simulateReferralNotification('signup');
        }
        
        dispatch(setUser(data?.data));
        localStorage.setItem("user",JSON.stringify(data?.data));
        
        // Check if user came from listing creation flow
        const returnTo = location.state?.returnTo;
        const hasListingData = location.state?.listingData;
        
        if (returnTo === "/addList" && hasListingData) {
            // Redirect back to listing creation flow
            navigate("/addList");
        } else {
            // Otherwise, redirect to signup success page
            navigate("/auth/signup-success");
        }
    }
    
    const onError = (error)=>{
        console.log("data",error);
        setRegisterError(error?.response?.data?.message);
    }
    
    const registerUser = useRegisterUser(onSuccess,onError);
    
    // Validate referral code
    const validateReferralCode = (code) => {
        if (!code) {
            setReferralCodeValid(false);
            setReferralCodeMessage("");
            return;
        }
        
        setReferralCodeChecking(true);
        
        // Simulate API call to validate code
        setTimeout(() => {
            try {
                // In a real implementation, this would be an API call
                const isValid = code.length >= 5; // Simple validation for demo
                setReferralCodeValid(isValid);
                
                if (isValid) {
                    setReferralCodeMessage("Valid code! You'll receive 1 draw ticket.");
                } else {
                    setReferralCodeMessage("Invalid referral code.");
                }
            } catch (error) {
                console.error("Error validating referral code:", error);
                setReferralCodeMessage("Error validating code. Please try again.");
                setReferralCodeValid(false);
            } finally {
                setReferralCodeChecking(false);
            }
        }, 500);
    };
    
    const onSubmit = (data)=>{ 
        // Add referral code to the data if valid
        if (referralCodeValid && data.referralCode) {
            data.hasValidReferral = true;
        }
        registerUser.mutate(data);
    }

    
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
        <section className='my-auto w-full'>
            <div className='max-w-md mx-auto h-full flex py-6 sm:py-12 md:py-20 px-4'>
                <form 
                    className='shadow-md mx-auto border p-5 sm:p-8 rounded-lg text-center flex flex-col gap-4 sm:gap-5 w-full bg-white'
                    onSubmit={handleSubmit(onSubmit)}
                    aria-labelledby="register-heading"
                >
                    <div className='px-2 sm:px-6'>
                        <h2 id="register-heading" className='font-bold text-xl sm:text-2xl'>Create an Account</h2>
                        <p className='text-gray-600 text-sm sm:text-base mt-1'>Join Selliox to start listing your services</p>
                    </div>
                    {hasListingData && (
                        <div className="text-sm text-primaryA0 mt-2 bg-primaryA0/5 py-2 px-3 rounded-md">
                            You'll be redirected back to complete your listing after registration
                        </div>
                    )}
                    
                    {/* Full Name Field */}
                    <div className='flex flex-col mt-2 text-start'>
                        <label htmlFor='fullName' className="text-sm font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <FaUser size={16} aria-hidden="true" />
                            </div>
                            <input 
                                {...register("fullName")}
                                id='fullName' 
                                type='text' 
                                className='input-control py-2.5 pl-10 border w-full rounded-md focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 focus:outline-none transition-colors'
                                placeholder="Your full name"
                                autoComplete="name"
                                aria-invalid={errors.fullName ? "true" : "false"}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500" role="alert">{errors.fullName.message}</p>
                        )}
                    </div>
                    
                    {/* Username Field */}
                    <div className='flex flex-col mt-2 text-start'>
                        <label htmlFor='username' className="text-sm font-medium mb-1">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <FaUserTag size={16} aria-hidden="true" />
                            </div>
                            <input 
                                {...register("username")}
                                id='username' 
                                type='text' 
                                className='input-control py-2.5 pl-10 border w-full rounded-md focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 focus:outline-none transition-colors'
                                placeholder="Choose a unique username"
                                autoComplete="username"
                                aria-invalid={errors.username ? "true" : "false"}
                            />
                        </div>
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500" role="alert">{errors.username.message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Username cannot be changed later</p>
                    </div>
                    
                    {/* Email Field */}
                    <div className='flex flex-col text-start'>
                        <label htmlFor='email' className="text-sm font-medium mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <FaEnvelope size={16} aria-hidden="true" />
                            </div>
                            <input 
                                {...register("email")}
                                id='email' 
                                type='email' 
                                className='input-control py-2.5 pl-10 border w-full rounded-md focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 focus:outline-none transition-colors'
                                placeholder="your@email.com"
                                autoComplete="email"
                                aria-invalid={errors.email ? "true" : "false"}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500" role="alert">{errors.email.message}</p>
                        )}
                    </div>
                    
                    {/* Password Field */}
                    <div className='flex flex-col text-start'>
                        <label htmlFor='password' className="text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <FaLock size={16} aria-hidden="true" />
                            </div>
                            <input 
                                {...register("password")}
                                id='password' 
                                type='password' 
                                className='input-control py-2.5 pl-10 border w-full rounded-md focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 focus:outline-none transition-colors'
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500" role="alert">{errors.password.message}</p>
                        )}
                    </div>
                    
                    {/* Referral Code Field */}
                    <div className='flex flex-col text-start'>
                        <label htmlFor='referralCode' className="text-sm font-medium mb-1">Referral Code <span className="text-gray-500 text-xs">(optional)</span></label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <FaTicketAlt size={16} aria-hidden="true" />
                            </div>
                            <input 
                                {...register("referralCode", { required: false })}
                                id='referralCode' 
                                type='text' 
                                className='input-control py-2.5 pl-10 border w-full rounded-md focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 focus:outline-none transition-colors'
                                placeholder="Enter referral code"
                                onChange={(e) => validateReferralCode(e.target.value)}
                                aria-describedby="referralCodeHelp"
                                autoComplete="off"
                            />
                            {referralCodeChecking && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FaSpinner className="animate-spin text-gray-400" size={16} />
                                </div>
                            )}
                            {referralCodeValid && !referralCodeChecking && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FaCheckCircle className="text-green-500" size={16} />
                                </div>
                            )}
                        </div>
                        {referralCodeMessage && (
                            <p 
                                id="referralCodeHelp" 
                                className={`mt-1 text-xs ${referralCodeValid ? "text-green-600" : "text-red-500"}`}
                            >
                                {referralCodeMessage}
                            </p>
                        )}
                    </div>
                    
                    {/* Submit Button */}
                    <div className="mt-4">
                        <button 
                            className='bg-primaryA0 py-2.5 rounded-md text-white w-full flex justify-center items-center hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0 disabled:opacity-70'
                            type='submit'
                            disabled={registerUser.isLoading}
                            aria-busy={registerUser.isLoading}
                        >
                            {registerUser.isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" aria-hidden="true" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </div>
                    
                    {/* Error Message */}
                    {registerError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm" role="alert">
                            {registerError}
                        </div>
                    )}
                    
                    {/* Login Link */}
                    <div className='text-sm mt-2 font-normal text-gray-600'>
                        Already have an account? <Link to="/auth/login" className='text-primaryA0 hover:underline transition-colors'>Sign in</Link>
                    </div>
                </form>
            </div>
        </section>
    </div>
  )
}

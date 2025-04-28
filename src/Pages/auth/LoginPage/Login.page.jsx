import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useDispatch } from "react-redux";
import { signinSchema } from '../../../utils/validations/userSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm} from "react-hook-form";
import useLoginUser from '../../../utils/react-query-hooks/auth/useLoginUser';
import { setUser } from '../../../redux/slices/user.slice';
import { FaSpinner, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginPage() {
    const [ loginError , setLoginError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [hasListingData, setHasListingData] = useState(false);
    
    // Check if user has incomplete listing data
    useEffect(() => {
        const listingData = localStorage.getItem('listingFormData');
        if (listingData) {
            setHasListingData(true);
        };
    }, []);
    
    const onSuccess = (data)=>{ 
        dispatch(setUser(data?.data));
        localStorage.setItem("user",JSON.stringify(data?.data));
        
        // Check if user was creating a listing before login
        if (hasListingData) {
            navigate("/addList");
        } else {
            navigate("/");
        };
    }
    
    const onError = (error)=>{
        console.log("data",error);
        setLoginError(error?.response?.data?.message);
    }
    
    const loginUser = useLoginUser(onSuccess,onError);

    const onSubmit = (data)=>{
        setLoginError(null);
        loginUser.mutate(data, {
            onSuccess: (response) => {
            console.log("Login successful:", response);
            },
            onError: (error) => {
            console.error("Login failed:", error);
            }
        });
        }

    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm({
        resolver: yupResolver(signinSchema)
    })
    
  return (
    <div className='min-h-screen flex flex-col'>
        <section className='my-auto w-full'>
            <div className='max-w-md mx-auto h-full flex py-8 sm:py-12 md:py-20 px-4'>
                <form 
                    className='shadow-lg mx-auto border p-5 sm:p-8 rounded-lg text-center capitalize flex flex-col gap-4 w-full bg-white'
                    onSubmit={handleSubmit(onSubmit)}
                    aria-labelledby="login-heading"
                >
                    <div className='px-4 sm:px-6'>
                        <h1 id="login-heading" className='text-xl sm:text-2xl font-medium mb-2'>Login to continue</h1>
                        <p className='text-xs text-gray-500'>Enter your credentials to access your account</p>
                        {hasListingData && (
                            <div className="text-sm text-primaryA0 mt-2 bg-primaryA0/5 py-2 px-3 rounded-md">
                                You'll be redirected back to complete your listing after login
                            </div>
                        )}
                    </div>
                    
                    <div className='flex flex-col mt-2 text-start'>
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
                                autoComplete="current-password"
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500" role="alert">{errors.password.message}</p>
                        )}
                    </div>
                    
                    <div className="mt-2">
                        <button 
                            className='bg-primaryA0 py-2.5 rounded-md text-white capitalize w-full flex justify-center items-center hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0 disabled:opacity-70'
                            type='submit'
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" aria-hidden="true" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign in</span>
                            )}
                        </button>
                    </div>
                    
                    {loginError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm" role="alert">
                            {loginError}
                        </div>
                    )}
                    
                    <div className='text-sm mt-2 font-normal text-gray-600'>
                        {`Don't have an account? `}
                         <Link to="/auth/register" className='text-primaryA0 hover:underline transition-colors'>Register now</Link>
                    </div>
                </form>
            </div>
        </section>
    </div>
  )
}

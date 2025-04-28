import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import useUpdateUser from '../../../utils/react-query-hooks/auth/useUpdateUser';
import { updateUserSchema } from '../../../utils/validations/userSchema';
import AvatarImage from "../../../Components/DefaultImage/DefaultAvaterImage";
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaSave, FaExclamationCircle } from 'react-icons/fa';
import { setUser } from '../../../redux/slices/user.slice';
import config from '../../../config';
export default function SettingsAccountPage() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const apiURL = config.BACKEND_URL;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, formState: { errors }, handleSubmit, reset } = useForm({
    resolver: yupResolver(updateUserSchema),
    defaultValues: user
  });
   
  // Success and error handlers 
  const onSuccess = (data) => {
    console.log("res", data);
    setSuccessMessage("Account updated successfully");
    setIsSubmitting(false);
    
    // Update user in Redux and localStorage
    if (data?.data) {
      dispatch(setUser(data.data));
      localStorage.setItem("user", JSON.stringify(data.data));
    }
    
    // Reset password fields
    setShowPasswordFields(false);
    
    // Show success message briefly
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };
  
  const onError = (error) => {
    console.log(error);
    setErrorMessage(error?.response?.data?.message || error.message || "Failed to update account");
    setIsSubmitting(false);
    
    // Show error message briefly
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };
  
  const updateUser = useUpdateUser(onSuccess, onError);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Remove empty fields
    const query = {};
    if (data.fullName !== user?.fullName) {
      query.fullName = data.fullName; // Add to query if it has changed
    }
    if (data.username !== user?.username) {
      query.username = data.username; // Add to query if it has changed
    }
    
    // Handle password change
    if (showPasswordFields && data.password && data.newPassword) {
      query.currentPassword = data.password;
      query.password = data.newPassword;
    }
    
    updateUser.mutate(query);
  }
  
  return (
    <div className='max-w-4xl mx-auto py-6 px-4 sm:px-6'>
      {/* Profile Header */}
      <div className='mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Account Settings</h2>
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
          {user?.Avatar ? 
            <img src={`${apiURL}/${user?.Avatar}`} alt='avatar' className='w-16 h-16 object-cover rounded-full bg-black shadow-sm' /> 
            : 
            <div className='w-16 h-16 rounded-full flex items-center justify-center bg-primaryA0 text-white text-xl font-bold shadow-sm'>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          }
          <div className='flex flex-col text-center sm:text-left'>
            <span className='text-lg font-semibold'>{user?.fullName}</span>
            <span className='text-sm text-gray-500'>@{user?.username}</span>
            <span className='text-xs text-gray-400 mt-1'>{user?.email}</span>
          </div>
        </div>
      </div>
      
      {/* Main Form */}
      <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-100'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information Section */}
          <div className='mb-8'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4 flex items-center'>
              <FaUser className='mr-2 text-primaryA0' size={16} />
              Personal Information
            </h3>
            <p className='text-sm text-gray-500 mb-4'>Update your personal information and how others see you on the platform.</p>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='fullName' className='text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  {...register("fullName")}
                  className='px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0 transition-colors'
                  id='fullName'
                  type='text'
                  placeholder='Your full name'
                />
                {errors.fullName && (
                  <p className='mt-1 text-xs text-red-500'>{errors.fullName.message}</p>
                )}
              </div>
              
              <div className='flex flex-col gap-1'>
                <label htmlFor='username' className='text-sm font-medium text-gray-700'>Username</label>
                <input
                  {...register("username")}
                  className='px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0 transition-colors'
                  id='username'
                  type='text'
                  placeholder='Your username'
                />
                {errors.username && (
                  <p className='mt-1 text-xs text-red-500'>{errors.username.message}</p>
                )}
              </div>
              
              <div className='flex flex-col gap-1 md:col-span-2'>
                <label htmlFor='email' className='text-sm font-medium text-gray-700'>Email Address</label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                    <FaEnvelope size={16} />
                  </div>
                  <input 
                    className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50'
                    {...register("email")}
                    id='email'
                    type='email'
                    disabled
                  />
                </div>
                <p className='mt-1 text-xs text-gray-500'>Email cannot be changed</p>
              </div>
            </div>
          </div>
          
          {/* Password Section */}
          <div className='mb-8'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4 flex items-center'>
              <FaLock className='mr-2 text-primaryA0' size={16} />
              Password
            </h3>
            <p className='text-sm text-gray-500 mb-4'>Secure your account with a strong password. We recommend using a combination of letters, numbers, and special characters.</p>
            
            <div className='mb-4'>
              <button
                type='button'
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className='text-primaryA0 hover:text-primaryA0/80 text-sm font-medium flex items-center'
              >
                <FaLock className='mr-1' size={14} />
                {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
              </button>
            </div>
            
            {showPasswordFields && (
              <div className='space-y-4 pt-2 pl-4 border-l-2 border-primaryA0/20'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor='currentPassword' className='text-sm font-medium text-gray-700'>Current Password</label>
                  <input
                    {...register("password")}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0 transition-colors'
                    id='currentPassword'
                    type='password'
                    placeholder='Enter your current password'
                  />
                  {errors.password && (
                    <p className='mt-1 text-xs text-red-500'>{errors.password.message}</p>
                  )}
                </div>

                <div className='flex flex-col gap-1'>
                  <label htmlFor='newPassword' className='text-sm font-medium text-gray-700'>New Password</label>
                  <input
                    {...register("newPassword")}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0 transition-colors'
                    id='newPassword'
                    type='password'
                    placeholder='Enter new password'
                  />
                  {errors.newPassword && (
                    <p className='mt-1 text-xs text-red-500'>{errors.newPassword.message}</p>
                  )}
                </div>

                <div className='flex flex-col gap-1'>
                  <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>Confirm New Password</label>
                  <input
                    {...register("confirmPassword")}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0 transition-colors'
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm new password'
                  />
                  {errors.confirmPassword && (
                    <p className='mt-1 text-xs text-red-500'>{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          

          
          {/* Status Messages */}
          {successMessage && (
            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start mb-6'>
              <FaSave className='mr-2 mt-0.5' />
              <span>{successMessage}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-6'>
              <FaExclamationCircle className='mr-2 mt-0.5' />
              <span>{errorMessage}</span>
            </div>
          )}
          
          {/* Submit Button */}
          <div className='flex justify-end'>
            <button 
              type='submit'
              disabled={isSubmitting}
              className='px-6 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors flex items-center disabled:opacity-70 shadow-sm'
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className='animate-spin mr-2' />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className='mr-2' />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

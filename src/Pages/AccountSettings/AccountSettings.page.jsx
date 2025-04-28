import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserSchema } from '../../utils/validations/userSchema';
import { FaEnvelope, FaLock, FaUser, FaSpinner, FaSave, FaExclamationCircle, FaBell, FaShieldAlt, FaLink } from 'react-icons/fa';
import { setUser } from '../../redux/slices/user.slice';
import useUpdateUser from '../../utils/react-query-hooks/auth/useUpdateUser';
import { getReferralCode } from '../../utils/referralCode';

const AccountSettingsPage = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#6663FD');
  const [activeTab, setActiveTab] = useState('profile');
  const [referralCode, setReferralCode] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      username: user?.username || '',
    }
  });
  
  // Watch password fields to enable validation
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Generate avatar color based on username and set referral code
  useEffect(() => {
    if (user?.username) {
      // Generate a consistent color based on the username
      const colors = [
        '#4F46E5', // Indigo
        '#7C3AED', // Violet
        '#EC4899', // Pink
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#6366F1', // Indigo
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#F43F5E', // Rose
      ];
      
      // Use the sum of character codes to select a color
      const charSum = user.username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const colorIndex = charSum % colors.length;
      setAvatarColor(colors[colorIndex]);
      
      // Set referral code
      if (user) {
        const code = getReferralCode(user);
        setReferralCode(code);
      }
      
      // Update form values when user data is loaded
      setValue('fullName', user.fullName || '');
      setValue('email', user.email || '');
      setValue('username', user.username || '');
      setValue('about', user.about || '');
    }
  }, [user, setValue]);

  const onUpdateSuccess = (data) => {
    dispatch(setUser(data?.data));
    localStorage.setItem("user", JSON.stringify(data?.data));
    setUpdateSuccess(true);
    setUpdateError(null);
    
    // Reset password fields
    setValue('password', '');
    setValue('newPassword', '');
    setValue('confirmPassword', '');
    
    // Reset loading state
    updateUserMutation.reset();
    
    // Show success message briefly
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);
  };

  const onUpdateError = (error) => {
    setUpdateError(error?.response?.data?.message || 'Failed to update account');
    setUpdateSuccess(false);
    
    // Reset loading state
    updateUserMutation.reset();
  };

  const updateUserMutation = useUpdateUser(onUpdateSuccess, onUpdateError);

  const onSubmit = (data) => {
    // Remove empty fields
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] === undefined) {
        delete data[key];
      }
    });
    
    // Handle password change
    if (activeTab === 'security' && data.newPassword) {
      // Check if passwords match
      if (data.newPassword !== data.confirmPassword) {
        setUpdateError('New password and confirm password do not match');
        return;
      }
      
      // Create a copy of data for password update
      const passwordData = {
        password: data.password,  // Current password
        newPassword: data.newPassword  // New password to set
      };
      
      updateUserMutation.mutate(passwordData);
    } else {
      // For profile updates, remove password fields
      delete data.password;
      delete data.newPassword;
      delete data.confirmPassword;
      
      updateUserMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <div className="flex space-x-1 mt-4 border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium text-sm rounded-t-md ${activeTab === 'profile' 
                ? 'text-primaryA0 border-b-2 border-primaryA0' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-medium text-sm rounded-t-md ${activeTab === 'security' 
                ? 'text-primaryA0 border-b-2 border-primaryA0' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 font-medium text-sm rounded-t-md ${activeTab === 'referrals' 
                ? 'text-primaryA0 border-b-2 border-primaryA0' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Referrals
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                {/* Avatar with first letter of username */}
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
                  style={{ backgroundColor: avatarColor }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-800">{user?.fullName || 'User'}</h2>
                  <div className="text-sm text-gray-500 mb-2">@{user?.username || 'username'}</div>
                  <div className="text-sm text-gray-600">{user?.email || 'email@example.com'}</div>
                  <div className="mt-3 text-xs text-gray-500">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="p-5 bg-white rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaUser className="mr-2 text-primaryA0" size={18} />
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        {...register("fullName")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryA0 focus:border-primaryA0 bg-white"
                        placeholder="Your full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryA0 focus:border-primaryA0 bg-white"
                        placeholder="Your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                      About
                    </label>
                    <textarea
                      id="about"
                      {...register("about")}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryA0 focus:border-primaryA0 bg-white"
                      placeholder="Tell others a bit about yourself"
                    />
                  </div>
                </div>
                
                {/* Status Messages */}
                {updateSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
                    <FaSave className="mr-2 mt-0.5" />
                    <span>Account settings updated successfully!</span>
                  </div>
                )}
                
                {updateError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                    <FaExclamationCircle className="mr-2 mt-0.5" />
                    <span>{updateError}</span>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateUserMutation.isLoading}
                    className="px-6 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors flex items-center disabled:opacity-70"
                  >
                    {updateUserMutation.isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <div className="p-5 bg-white rounded-lg border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaShieldAlt className="mr-2 text-primaryA0" size={18} />
                  Password & Security
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        {...register("password")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                        placeholder="Enter current password"
                      />
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        {...register("newPassword")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                        placeholder="Enter new password"
                      />
                      {errors.newPassword && (
                        <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  {updateSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
                      <FaSave className="mr-2 mt-0.5" />
                      <span>Password updated successfully!</span>
                    </div>
                  )}
                  
                  {updateError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                      <FaExclamationCircle className="mr-2 mt-0.5" />
                      <span>{updateError}</span>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updateUserMutation.isLoading}
                      className="px-6 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors flex items-center disabled:opacity-70"
                    >
                      {updateUserMutation.isLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div>
              <div className="p-5 bg-white rounded-lg border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaLink className="mr-2 text-primaryA0" size={18} />
                  Your Referral Code
                </h2>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="text-sm text-gray-600 mb-2">Share this code with friends to earn rewards:</div>
                  <div className="flex items-center">
                    <div className="bg-white border border-gray-300 rounded-md px-4 py-2 font-mono text-lg font-medium flex-grow">
                      {referralCode}
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(referralCode);
                        // Show a toast or some feedback
                      }}
                      className="ml-2 px-4 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">How the Referral Program Works</h3>
                  <ul className="text-sm text-blue-700 space-y-2 list-disc pl-5">
                    <li>Share your referral code with friends and family</li>
                    <li>When they sign up, you earn 1 ticket for the $1,000 monthly prize draw</li>
                    <li>When they create a listing, you earn 5 more tickets</li>
                    <li>They get their first month free when they use your code</li>
                    <li>The more people you refer, the better your chances to win!</li>
                  </ul>
                  <div className="mt-4">
                    <a href="/referral-dashboard" className="text-primaryA0 font-medium hover:underline">Go to Referral Dashboard →</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;

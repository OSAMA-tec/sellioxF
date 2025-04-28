import React, { useState, useEffect } from 'react'
import Rating from '../Rating/Rating'
import config from '../../config'
import { format } from 'date-fns'
import { FaStar } from 'react-icons/fa'

export default function Review({ review }) {
  const apiURL = config.BACKEND_URL;
  const createdAtDate = new Date(review?.createdAt);
  
  // Format date for display
  const formattedDate = format(createdAtDate, 'MMM d, yyyy');
  
  // Calculate days ago for display
  const today = new Date();
  let diff_in_time = today.getTime() - createdAtDate.getTime();
  diff_in_time = Math.round(diff_in_time / (1000 * 3600 * 24))
  
  const timeDisplay = diff_in_time === 0 ? 'Today' : 
                      diff_in_time === 1 ? 'Yesterday' : 
                      `${diff_in_time} days ago`;

  const [imgSrc, setImgSrc] = useState(`${apiURL}/${review?.buyerAvatar}`);
  const [showAvatar, setShowAvatar] = useState(true);
  const [avatarColor, setAvatarColor] = useState('#6663FD');
  
  // Generate a color for the avatar based on the username
  useEffect(() => {
    if (review?.username) {
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
      const charSum = review.username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const colorIndex = charSum % colors.length;
      setAvatarColor(colors[colorIndex]);
    }
  }, [review?.username]);
  
  const handleError = () => {
    setShowAvatar(false); // Hide the image and show the letter avatar instead
  };
  
  // Get the first letter of the username for the avatar
  const getUserInitial = () => {
    if (review?.username && review.username.length > 0) {
      return review.username.charAt(0).toUpperCase();
    } else if (review?.buyerName && review.buyerName.length > 0) {
      return review.buyerName.charAt(0).toUpperCase();
    }
    return "U";
  };
  
  // Generate rating stars
  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
        size={16}
      />
    ));
  };

  return (
    <div className='bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-3'>
        <div className='flex gap-3 items-center'>
          <div className="relative">
            {showAvatar ? (
              <img 
                src={imgSrc} 
                onError={handleError} 
                className='w-12 h-12 rounded-full object-cover border-2 border-gray-100' 
                alt={review?.username || review?.buyerName || 'Reviewer'}
              />
            ) : (
              <div 
                className='w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-gray-100'
                style={{ backgroundColor: avatarColor }}
              >
                {getUserInitial()}
              </div>
            )}
          </div>
          <div className='flex flex-col'>
            <span className='font-medium text-gray-800'>
              {review?.username || review?.buyerName}
            </span>
            <span className='text-xs text-gray-500'>{formattedDate}</span>
          </div>
        </div>
        <div className='text-xs text-gray-500 italic'>
          {timeDisplay}
        </div>
      </div>
      
      <div className='flex items-center gap-2 mb-3'>
        <div className='flex'>
          {renderRatingStars(review?.rating)}
        </div>
        <span className='text-sm font-medium ml-1'>{review?.rating}.0</span>
      </div>
      
      <div className='text-gray-700 text-sm'>
        {review?.comment}
      </div>
    </div>
  )
}

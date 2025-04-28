import React, { useState } from 'react'
import Review from '../../../Components/Review/Review';
import AddReviewForm from '../components/AddReviewForm';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaStarHalfAlt, FaCommentAlt } from 'react-icons/fa';

export default function ReviewsListingSection({reviews, refetch}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const user = useSelector(state => state.user.user);
    
    const handleExpanded = () => {
        setIsExpanded(!isExpanded)
    };
    
    // Calculate average rating
    const calculateAverageRating = () => {
        if (!reviews || reviews.length === 0) return 0;
        
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };
    
    const averageRating = calculateAverageRating();
    
    // Generate rating stars
    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300" />);
            }
        }
        
        return stars;
    };
    
    // Rating distribution
    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0]; // 5 stars, 4 stars, 3 stars, 2 stars, 1 star
        
        if (!reviews || reviews.length === 0) return distribution;
        
        reviews.forEach(review => {
            const rating = Math.floor(review.rating);
            if (rating >= 1 && rating <= 5) {
                distribution[5 - rating]++;
            }
        });
        
        return distribution;
    };
    
    const ratingDistribution = getRatingDistribution();
    const totalReviews = reviews?.length || 0;
    
    return (
        <div className='mt-6 flex flex-col w-full rounded-md'>
            <AddReviewForm isExpanded={isExpanded} handleExpanded={handleExpanded} refetch={refetch}/>
            
            {reviews?.length ? (
                <div className='flex flex-col gap-6'>
                    {/* Rating summary section */}
                    <div className='bg-gray-50 rounded-lg p-4 sm:p-6 mb-2'>
                        <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
                            {/* Left side - average rating */}
                            <div className='flex flex-col items-center justify-center md:w-1/3'>
                                <h3 className='text-lg font-medium mb-2'>Overall Rating</h3>
                                <div className='text-4xl font-bold text-gray-800 mb-2'>{averageRating}</div>
                                <div className='flex gap-1 mb-2'>
                                    {renderRatingStars(averageRating)}
                                </div>
                                <div className='text-sm text-gray-500'>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</div>
                            </div>
                            
                            {/* Right side - rating distribution */}
                            <div className='md:w-2/3 md:border-l md:pl-6'>
                                <h3 className='text-lg font-medium mb-3 md:text-center'>Rating Distribution</h3>
                                <div className='space-y-2'>
                                    {[5, 4, 3, 2, 1].map((star, index) => {
                                        const count = ratingDistribution[5 - star];
                                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                        
                                        return (
                                            <div key={star} className='flex items-center gap-2'>
                                                <div className='flex items-center gap-1 w-16'>
                                                    <span className='text-sm font-medium'>{star}</span>
                                                    <FaStar className='text-yellow-400 text-sm' />
                                                </div>
                                                <div className='flex-1 bg-gray-200 rounded-full h-2.5'>
                                                    <div 
                                                        className='bg-yellow-400 h-2.5 rounded-full' 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className='w-10 text-xs text-gray-500 text-right'>{count}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Reviews header */}
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4'>
                        <h4 className='text-xl font-semibold flex items-center gap-2'>
                            <FaCommentAlt className='text-primaryA0' />
                            Customer Reviews
                        </h4>
                        {user && (
                            <button 
                                className='w-full sm:w-auto px-4 py-2 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors flex items-center justify-center sm:justify-start gap-2'
                                onClick={handleExpanded}
                            >
                                <FaStar className='text-yellow-300' />
                                Write a Review
                            </button>
                        )}
                    </div>
                    
                    {/* Reviews grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                        {reviews?.map((r, i) => (
                            <Review key={i} review={r} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-4 px-4 sm:px-6 items-center py-8 sm:py-12 bg-gray-50 rounded-lg text-center'>
                    {user ? (
                        <>
                            <div className='text-5xl text-gray-300 mb-2'>
                                <FaCommentAlt />
                            </div>
                            <h3 className='text-xl font-medium mb-2'>No Reviews Yet</h3>
                            <p className='text-gray-600 mb-4'>Be the first to review this business.</p>
                            <button 
                                className='w-full sm:w-auto px-6 py-2.5 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors flex items-center justify-center gap-2'
                                onClick={handleExpanded}
                            >
                                <FaStar className='text-yellow-300' />
                                Write a Review
                            </button>
                        </>
                    ) : (
                        <>
                            <div className='text-5xl text-gray-300 mb-2'>
                                <FaCommentAlt />
                            </div>
                            <h3 className='text-xl font-medium mb-2'>No Reviews Yet</h3>
                            <p className='text-gray-600'>Sign in to be the first to review this business.</p>
                        </>
                    )}
                </div>
            )}
            
            {/* Show listing ID at the bottom as requested */}
            <div className="mt-8 text-center text-xs text-gray-400">
                Listing ID: #{reviews?.[0]?.listingId || 'N/A'}
            </div>
        </div>
    )
}

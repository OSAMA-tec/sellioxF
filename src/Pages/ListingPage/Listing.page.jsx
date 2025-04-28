import React, { useState, useEffect } from "react";
import { CiLocationOn } from "react-icons/ci";
import SwiperGallery from "../../Components/Swiper/SwiperGallery";
import { FaRegMessage, FaStar, FaPhone, FaGlobe } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import ReviewsListingSection from "./sections/Reviews.Listing.Section";
import useFindListing from "../../utils/react-query-hooks/Listings/useFindListing.jsx";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import EmailSellerForm from "./components/EmailTheSellerForm.jsx";
import { useSelector } from 'react-redux';
import config from '../../config';
export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useFindListing(id);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useSelector(state=>state.user.user);
  const listing = data?.data?.listing;
  const apiURL = config.BACKEND_URL;
  
  const [imgSrc, setImgSrc] = useState(listing?.logo ? `${apiURL}/${listing?.logo}` : '');
  
  useEffect(() => {
    if (listing?.logo) {
      setImgSrc(`${apiURL}/${listing?.logo}`);
    }
  }, [listing, apiURL]);

  const handleExpanded = () => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page
      navigate('/auth/login');
      return;
    }
    
    setIsExpanded(!isExpanded);
  };
  
  const handleError = () => {
    setImgSrc(`${apiURL}/no-image.png`); // Fallback to placeholder image
  };
  
  const getRoundRating = (reviews) => {
    if (!listing?.reviews || !listing.reviews.length) {
      return "0.0";
    }
    
    const totalRatings = listing.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const calculatedMean = totalRatings / listing.reviews.length;
    return Number(calculatedMean).toFixed(1);
  };
  
  // Format location for display
  const formatLocation = (location) => {
    if (!location) return "Location unavailable";
    
    const parts = location.split(",").map(part => part.trim());
    if (parts.length <= 1) return location;
    
    return parts.join(", ");
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse h-10 w-10 bg-primaryA0 rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <ErrorBoundary isLoading={isLoading} isError={isError} error={error}>
        <EmailSellerForm isExpanded={isExpanded} handleExpanded={handleExpanded} sellerId={listing?.sellerId} />
        
        {/* Main Content Section */}
        <section className="pt-4 pb-8 md:py-8">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          
            {/* Gallery Section */}
            <div className="mb-6">
              <SwiperGallery serviceImages={listing?.serviceImages} />
            </div>

            {/* Listing Title - Visible on all screens */}
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-semibold">{listing?.serviceTitle}</h1>
                   
              <div className="flex flex-wrap gap-2 mt-2">
                {listing?.serviceCategory && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {listing.serviceCategory}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Service Details */}
              <div className="lg:col-span-2">
                {/* Message Seller Button - Mobile Only */}
                <div className="lg:hidden mb-6">
                  <button 
                    className="w-full py-3 rounded-lg shadow-sm flex justify-center items-center gap-2 bg-primaryA0 text-white" 
                    onClick={handleExpanded}
                  >
                    <FaRegMessage size={16} />
                    <span>Message the seller</span>
                  </button>
                </div>
                
                {/* Service Description */}
                <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                  <h2 className="text-lg font-semibold mb-4 border-b pb-2">Description</h2>
                  <div className="prose max-w-none">
                    {listing?.serviceDescription?.split('\n').map((paragraph, index) => (
                      paragraph.trim() ? (
                        <p key={index} className="mb-4 text-gray-700">
                          {paragraph}
                        </p>
                      ) : null
                    ))}
                  </div>
                </div>
                
                {/* Business Card - Mobile Version */}
                <div className="lg:hidden bg-white rounded-lg shadow-sm p-5 mb-6">
                  <h2 className="text-lg font-semibold mb-4 border-b pb-2">Business Details</h2>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={imgSrc} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" 
                        onError={handleError}
                        alt={listing?.businessTitle || 'Business logo'} 
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{listing?.businessTitle}</h3>
                        {listing?.listingNumber && (
                          <p className="text-sm text-gray-500">Listing #{listing.listingNumber}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <FaStar className="text-yellow-400" size={14} />
                          <span className="font-medium">{getRoundRating(listing?.reviews?.length)}</span>
                          <span className="text-gray-500">({listing?.reviews?.length || 0} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    {listing?.location && (
                      <div className="mb-4 border-t pt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <CiLocationOn size={20} className="text-primaryA0" />
                          <span>{formatLocation(listing.location)}</span>
                        </div>
                      </div>
                    )}
                    
                    {listing?.services && listing.services.length > 0 && (
                      <div className="mb-4 border-t pt-4">
                        <h4 className="font-medium mb-2">Services offered:</h4>
                        <ul className="space-y-2">
                          {listing.services.map((service, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <span className="w-2 h-2 bg-primaryA0 rounded-full"></span>
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {listing?.businessInfo && (
                      <div className="mb-4 border-t pt-4">
                        <h4 className="font-medium mb-2">About:</h4>
                        <p className="text-gray-700 text-sm">{listing.businessInfo}</p>
                      </div>
                    )}
                    
                    {listing?.website && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaGlobe size={16} className="text-primaryA0" />
                          <a 
                            href={listing.website.startsWith('http') ? listing.website : `https://${listing.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primaryA0 hover:underline text-sm break-all"
                          >
                            {listing.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-semibold mb-4 border-b pb-2">Reviews & Ratings</h2>
                  <ReviewsListingSection 
                    listingId={id} 
                    reviews={listing?.reviews} 
                    refetch={refetch} 
                  />
                </div>
              </div>
              
              {/* Right Column - Seller Info (Desktop only) */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4">
                  <div className="flex flex-col items-center mb-4">
                    <img 
                      src={imgSrc} 
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 mb-3" 
                      onError={handleError}
                      alt={listing?.businessTitle || 'Business logo'} 
                    />
                    <h3 className="font-semibold text-lg">{listing?.businessTitle}</h3>
                    
                    {listing?.listingNumber && (
                      <p className="text-sm text-gray-500 mb-2">Listing #{listing.listingNumber}</p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">{getRoundRating(listing?.reviews?.length)}</span>
                      <span className="text-gray-500">({listing?.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  {listing?.location && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CiLocationOn size={20} className="text-primaryA0" />
                        <span>{formatLocation(listing.location)}</span>
                      </div>
                    </div>
                  )}
                  
                  {listing?.services && listing.services.length > 0 && (
                    <>
                      <hr className="my-4" />
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Services offered:</h4>
                        <ul className="space-y-2">
                          {listing.services.map((service, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <span className="w-2 h-2 bg-primaryA0 rounded-full"></span>
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {listing?.businessInfo && (
                    <>
                      <hr className="my-4" />
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">About:</h4>
                        <p className="text-gray-700 text-sm">{listing.businessInfo}</p>
                      </div>
                    </>
                  )}
                  
                  {listing?.website && (
                    <>
                      <hr className="my-4" />
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaGlobe size={16} className="text-primaryA0" />
                        <a 
                          href={listing.website.startsWith('http') ? listing.website : `https://${listing.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primaryA0 hover:underline text-sm break-all"
                        >
                          {listing.website}
                        </a>
                      </div>
                    </>
                  )}
                  
                  <hr className="my-4" />
                  
                  <button 
                    className="w-full py-3 px-4 bg-primaryA0 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-primaryA0/90 transition-colors"
                    onClick={handleExpanded}
                  >
                    <FaRegMessage size={16} />
                    <span>Message the seller</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
    </div>
  );
}

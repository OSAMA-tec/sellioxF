import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBookmark, FaStar } from "react-icons/fa";
import { CiBookmark, CiLocationOn } from "react-icons/ci";
import axiosInstance from "../../utils/axiosInstance/axiosInstance";
import useSaveListing from "../../utils/react-query-hooks/Listings/useSaveListing";
import useRemoveSavedListing from "../../utils/react-query-hooks/Listings/useRemoveSavedListing";
import config from "../../config";
export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const apiURL = config.BACKEND_URL;

  useEffect(() => {
    if (user && listing._id) {
      checkIfSaved();
    }
  }, [listing._id, user]);

  const checkIfSaved = async () => {
    try {
      const response = await axiosInstance.get(`/listing/saved/check/${listing._id}`);
      if (response.data && response.data.isSaved) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/listing/${listing._id}`);
  };

  const getRatingDisplay = () => {
    const totalRatings = listing?.reviews?.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const calculatedMean = listing?.reviews?.length
      ? totalRatings / listing?.reviews.length
      : 0;
    return {
      rating: calculatedMean ? Number(calculatedMean).toFixed(1) : "0.0",
      count: listing?.reviews?.length || 0
    };
  };

  const ratingInfo = getRatingDisplay();

  const onSaveSuccess = () => setSaved(true);
  const onSaveError = () => setSaved(false);
  const onRemoveSuccess = () => setSaved(false);
  const onRemoveError = () => setSaved(true);

  const saveListing = useSaveListing({ onSuccess: onSaveSuccess, onError: onSaveError });
  const removeSavedListing = useRemoveSavedListing({ onSuccess: onRemoveSuccess, onError: onRemoveError });

  const handleSaveToggle = (e) => {
    e.stopPropagation();

    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (saved) {
      removeSavedListing.mutate(listing._id);
    } else {
      saveListing.mutate(listing._id);
    }
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  // Prepare location for display
  const locationParts = listing.location?.split(",") || [];
  const shortLocation = locationParts.length >= 2
    ? `${locationParts[0].trim()}, ${locationParts[1].trim()}`
    : listing.location || "";

  // Check if we have images
  const hasImages = listing.serviceImages && listing.serviceImages.length > 0;

  return (
    <div
      onClick={handleNavigate}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative w-full pt-[60%] overflow-hidden">
        <img
          src={hasImages ? `${apiURL}/${listing.serviceImages[0]}` : `${apiURL}/no-image.png`}
          onError={handleImageError}
          alt={listing.serviceTitle || "Listing image"}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-300 ${imageLoaded ? "" : "opacity-0"}`}
          loading="lazy"
        />
        {!imageLoaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}

        {/* Save Button */}
        <button
          className="absolute right-3 top-3 bg-white shadow-md rounded-full p-2 z-10 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
          onClick={handleSaveToggle}
          aria-label={saved ? "Remove from saved" : "Save listing"}
        >
          {user && saved ? (
            <FaBookmark size={16} className="text-primaryA0" />
          ) : (
            <CiBookmark size={18} className="text-primaryA0" />
          )}
        </button>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-white">
              <CiLocationOn size={16} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate max-w-[150px] font-medium">{shortLocation}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <FaStar className="text-yellow-400 flex-shrink-0" size={14} />
              <span className="text-xs sm:text-sm font-medium">{ratingInfo.rating}</span>
              <span className="text-xs opacity-80">({ratingInfo.count})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-3 sm:p-4">
        <h3 className="font-medium text-base sm:text-lg truncate text-gray-900">
          {listing.serviceTitle || "Untitled Listing"}
        </h3>

        <div className="mt-2 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-2 sm:line-clamp-3">
            {listing.serviceDescription || "No description available"}
          </p>
        </div>

        {/* Price & Category Info */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
            {listing.category || "Uncategorized"}
          </span>
          <span className="text-sm font-semibold text-primaryA0">View Details</span>
        </div>
      </div>
    </div>
  );
} 
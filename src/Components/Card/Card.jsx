// Card.jsx
import React, { useState, useEffect } from "react";
import styles from "./card.module.css";
import { FaBookmark } from "react-icons/fa";
import { CiBookmark, CiLocationOn } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useSaveListing from "../../utils/react-query-hooks/Listings/useSaveListing";
import useRemoveSavedListing from "../../utils/react-query-hooks/Listings/useRemoveSavedListing";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance/axiosInstance";
import config from "../../config";
// import fallbackImg from '../../assets/images/no-image.png';

export default function Card({ card }) {
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Check if the listing is saved for this user when the component mounts
    if (user && card._id) {
      checkIfSaved();
    }
  }, [card._id, user]);

  const checkIfSaved = async () => {
    try {
      const response = await axiosInstance.get(`/listing/saved/check/${card._id}`);
      if (response.data && response.data.isSaved) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/listing/${card._id}`);
  };

  const getRoundRating = (reviews) => {
    const totalRatings = card?.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0);
    const calculatedMean = card?.reviews?.length ? totalRatings / card?.reviews.length : null;
    return calculatedMean ? Number(calculatedMean).toFixed(1) : "0.0";
  };

  const onSaveSuccess = () => {
    setSaved(true);
  };

  const onSaveError = () => {
    setSaved(false);
  };

  const onRemoveSuccess = () => {
    setSaved(false);
  };

  const onRemoveError = () => {
    setSaved(true);
  };

  const saveListing = useSaveListing({ onSuccess: onSaveSuccess, onError: onSaveError });
  const removeSavedListing = useRemoveSavedListing({ onSuccess: onRemoveSuccess, onError: onRemoveError });

  const handleSaveListing = (e) => {
    e.stopPropagation(); // Prevent navigating to listing page

    if (!user) {
      // Redirect to login page if user is not logged in
      navigate("/auth/login");
      return;
    }

    saveListing.mutate(card._id);
  };

  const handleRemoveSavedListing = (e) => {
    e.stopPropagation(); // Prevent navigating to listing page
    removeSavedListing.mutate(card._id);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Format location for better display
  // ============ Improved location formatting ============
  const formatLocation = () => {
    if (!card.location) return "Location not specified";

    // Split location by commas and trim each part
    const parts = card.location
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 0) return "Location not specified";
    if (parts.length === 1) return parts[0];

    // Format location as "Country › Region › District" if all parts available
    return parts.join(" › ");
  };

  const imageSrc =
    card.serviceImages && card.serviceImages.length > 0
      ? `${config.BACKEND_URL}/${card.serviceImages[0]}`
      : `${config.BACKEND_URL}/no-image.png`;

  return (
    <div
      className="w-full flex flex-col bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-200 hover:cursor-pointer h-full border border-gray-100"
      onClick={handleNavigate}
    >
      {/* Card Image Section */}
      <div className="relative w-full overflow-hidden bg-gray-200">
        {/* Loading state */}
        {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true"></div>}

        {/* Card Image */}
        <img
          src={imageSrc}
          onLoad={handleImageLoad}
          onError={handleImageError}
          alt={card.serviceTitle || "Listing image"}
          className={`w-full h-52 sm:h-48 md:h-56 lg:h-60 object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />

        {/* Save Button */}
        {user && (
          <button
            className={`absolute right-2 top-2 transition-all duration-200 rounded-full p-2 z-10 ${
              saved ? "bg-primaryA0/10 hover:bg-primaryA0/20" : "bg-white/90 hover:bg-gray-50 shadow-md"
            }`}
            onClick={saved ? handleRemoveSavedListing : handleSaveListing}
            aria-label={saved ? "Remove from saved" : "Save listing"}
          >
            {saved ? <FaBookmark size={16} className="text-primaryA0" /> : <CiBookmark size={18} className="text-primaryA0" />}
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-4">
        {/* Improved location display and rating info */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
          {/* Location with better formatting and wrapping */}
          <div className="flex items-center gap-1 text-gray-600 mb-1 sm:mb-0">
            <CiLocationOn size={16} className="flex-shrink-0 text-primaryA0" />
            <span className="text-xs sm:text-sm break-words w-full sm:w-auto">{formatLocation()}</span>
          </div>
          {/* Rating info */}
          <div className="flex items-center gap-1 text-gray-700">
            <FaStar className="text-yellow-400 flex-shrink-0" size={14} />
            <span className="text-xs sm:text-sm">{getRoundRating(card?.reviews?.length)}</span>
            <span className="text-xs sm:text-sm">({card?.reviews?.length || 0})</span>
          </div>
        </div>

        <h3 className="font-medium text-base md:text-lg truncate">{card.serviceTitle || "Untitled Listing"}</h3>
        <div className="mt-2 flex-grow">
          <p className="text-gray-600 text-sm sm:text-base line-clamp-2">
            {card.serviceDescription?.substring(0, 120) || "No description available"}
          </p>
        </div>
        <div className="mt-3 pt-2 border-t flex justify-end">
          <span className="text-sm font-medium text-primaryA0 hover:underline transition-colors">Read more</span>
        </div>
      </div>
    </div>
  );
}

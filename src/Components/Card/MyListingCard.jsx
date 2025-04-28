import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaEdit, FaToggleOn, FaToggleOff, FaCreditCard, FaEllipsisV } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import useDeactivateListing from "../../utils/react-query-hooks/Listings/useDeactivateListing";
import { toast } from "react-toastify";
import Dropdown from "../Dropdown/Dropdown";
import { format } from "date-fns";
import config from "../../config";
export default function MyListingCard({ card }) {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const apiURL = config.BACKEND_URL;

  // Handle successful deactivation/reactivation
  const onDeactivateSuccess = () => {
    toast.success("Listing status updated successfully");
  };

  // Handle error during deactivation/reactivation
  const onDeactivateError = (error) => {
    toast.error(error.response?.data?.message || "Failed to update listing status");
  };

  // Hook for deactivating a listing
  const deactivateListing = useDeactivateListing({
    onSuccess: onDeactivateSuccess,
    onError: onDeactivateError
  });

  // Get rating for the listing
  const getRoundRating = () => {
    const totalRatings = card?.reviews?.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const calculatedMean = card?.reviews?.length
      ? totalRatings / card?.reviews.length
      : null;
    return calculatedMean ? Number(calculatedMean).toFixed(1) : "0.0";
  };

  // Navigate to the listing page
  const handleNavigate = () => {
    navigate(`/listing/${card._id}`);
  };

  // Handle edit listing
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/editListing/${card._id}`);
  };

  // Handle deactivate/reactivate listing
  const handleToggleStatus = (e) => {
    e.stopPropagation();

    if (card.status === "active") {
      // Confirm before deactivating
      if (window.confirm("Are you sure you want to deactivate this listing?")) {
        deactivateListing.mutate(card._id);
      }
    } else {
      // Navigate to plan selection for reactivation
      navigate(`/reactivateListing/${card._id}`);
    }
  };

  // Handle plan management
  const handleManagePlan = (e) => {
    e.stopPropagation();
    navigate(`/updatePlan/${card._id}`);
  };

  // Get location parts for responsive display
  const locationParts = card.location.split(",");
  const shortLocation = locationParts.length >= 2
    ? `${locationParts[0].trim()}, ${locationParts[1].trim()}`
    : card.location;

  // Get plan info
  const planType = card.plan?.planType || "basic";
  const subscriptionEndDate = card.subscriptionEndDate
    ? format(new Date(card.subscriptionEndDate), "MMM dd, yyyy")
    : "N/A";

  // Determine status styles
  const getStatusColor = () => {
    switch (card.status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`w-full flex flex-col bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-200 h-full ${card.status !== "active" ? "opacity-75" : ""
        }`}
      onClick={handleNavigate}
    >
      {/* Card Image Section */}
      <div className="relative w-full">
        {/* Status Badge */}
        <div className={`absolute left-2 top-2 px-2 py-1 rounded-md z-10 text-xs font-medium ${getStatusColor()}`}>
          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
        </div>

        {/* Listing Number Badge */}
        <div className="absolute left-2 top-9 px-2 py-1 bg-white/80 text-gray-800 rounded-md z-10 text-xs font-medium">
          #{card.listingNumber || 'N/A'}
        </div>

        {/* Plan Badge */}
        <div className="absolute right-2 top-2 bg-primaryA0 text-white px-2 py-1 rounded-md z-10 text-xs font-medium capitalize">
          {planType}
        </div>

        {/* Card Image */}
        <img
          src={`${apiURL}/${card.serviceImages[0]}`}
          onError={(e) => { e.target.src = `${apiURL}/no-image.png` }}
          alt={card.serviceTitle}
          className={`w-full h-48 md:h-56 object-cover transition-opacity ${card.status !== "active" ? "grayscale" : ""}`}
          loading="lazy"
        />

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-2 px-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-white">
              <CiLocationOn size={16} className="flex-shrink-0" />
              <span className="text-xs truncate max-w-[150px]">{shortLocation}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <FaStar className="text-yellow-400 flex-shrink-0" size={14} />
              <span className="text-xs">{getRoundRating()}</span>
              <span className="text-xs">({card?.reviews?.length || 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base md:text-lg truncate">{card.serviceTitle}</h3>

          <Dropdown
            title={<FaEllipsisV className="text-gray-600 cursor-pointer" />}
            btnStyle="p-1 hover:bg-gray-100 rounded-full"
            menuStyle="right-0 w-44 mt-1 bg-white shadow-lg rounded-md overflow-hidden"
          >
            <div className="py-1 text-sm" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaEdit className="text-blue-600" />
                <span>Edit Listing</span>
              </button>

              <button
                onClick={handleToggleStatus}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                {card.status === "active" ? (
                  <>
                    <FaToggleOff className="text-red-600" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <FaToggleOn className="text-green-600" />
                    <span>Reactivate</span>
                  </>
                )}
              </button>

              {card.status === "active" && (
                <button
                  onClick={handleManagePlan}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaCreditCard className="text-purple-600" />
                  <span>Manage Plan</span>
                </button>
              )}
            </div>
          </Dropdown>
        </div>

        <div className="mt-2 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-2">
            {card.serviceDescription?.substring(0, 120)}
          </p>
        </div>

        <div className="mt-2 pt-2 border-t flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Expires: {subscriptionEndDate}
          </span>
          <span className="text-sm font-medium text-primaryA0 hover:underline">View details</span>
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaCheck, FaChevronRight, FaTimes, FaCrown, FaRocket, FaRegStar } from "react-icons/fa";

// Individual plan card component
const PlanCard = ({ plan, isSelected, onSelect, isPopular }) => {
  const { name, price, features, duration, id } = plan;
  
  return (
    <div 
      className={`relative flex flex-col border-2 rounded-xl transition-all duration-300 h-full ${
        isSelected 
          ? "border-primaryA0 shadow-lg" 
          : "border-gray-200 hover:border-gray-300 hover:shadow"
      } ${isPopular ? "md:transform md:-translate-y-4" : ""}`}
      onClick={() => onSelect(plan)}
    >
      {isPopular && (
        <div className="absolute -top-4 inset-x-0 mx-auto w-28 sm:w-36 text-center py-1 px-2 sm:px-4 bg-primaryA0 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md">
          Most Popular
        </div>
      )}
      
      <div className={`p-4 sm:p-6 rounded-t-xl ${isPopular ? "bg-primaryA0/10" : "bg-white"}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">30-day subscription</p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full">
            {isPopular ? 
              <FaCrown className="text-xl sm:text-2xl text-amber-500" /> : 
              (id === "basic" ? <FaRegStar className="text-xl sm:text-2xl text-blue-500" /> : <FaRocket className="text-xl sm:text-2xl text-purple-500" />)
            }
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 mb-2">
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">${price}</span>
        </div>
        
        <div className={`w-full py-2 px-3 sm:px-6 mt-3 sm:mt-4 mb-2 text-center rounded-md font-medium cursor-pointer transition-colors ${
          isSelected
            ? "bg-primaryA0 text-white"
            : isPopular ? "bg-white text-primaryA0 border border-primaryA0 hover:bg-primaryA0/5" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plan);
        }}
        >
          {isSelected ? "Selected" : "Select Plan"}
        </div>
      </div>
      
      <div className="flex-grow p-4 sm:p-6 bg-white rounded-b-xl">
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">WHAT'S INCLUDED:</p>
        <ul className="space-y-2 sm:space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 mt-0.5 text-green-500">
                <FaCheck size={14} />
              </span>
              <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PlanSelectionSection = ({ 
  selectedPlan, 
  setSelectedPlan, 
  handleNext,
  handleBack 
}) => {


  // Updated plans data according to specifications
  const plans = [
    {
      planType: "standard",
      name: "Basic",
      price: 10,
      duration: 30,
      id: "basic",
      features: [
        "Basic search visibility",
        "Upload up to 5 photos",
        "Manage one listing on your account",
        "30-day subscription"
      ],
      isPopular: false,
    },
    {
      planType: "premium",
      name: "Premium",
      price: 20,
      duration: 30,
      id: "premium",
      features: [
        "Higher search ranking",
        "Upload up to 10 photos",
        "Manage up to 5 listings on your account",
        "Highlighted listing in search results",
        "30-day subscription"
      ],
      isPopular: true,
    },
    {
      planType: "featured",
      name: "Featured",
      price: 35,
      duration: 30,
      id: "featured",
      features: [
        "Top placement in search results",
        "Featured placement on homepage",
        "Upload up to 10 photos",
        "Manage up to 10 listings on your account",
        "30-day subscription"
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Choose your subscription plan</h2>
        <p className="text-sm sm:text-base text-gray-600">Select the plan that best fits your needs. You can upgrade or downgrade anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isSelected={selectedPlan?.name === plan.name}
            isPopular={plan.isPopular}
            onSelect={setSelectedPlan}
          />
        ))}
      </div>



      {!selectedPlan ? (
        <div className="mt-8 mb-10">
          <h3 className="text-xl font-semibold mb-4">Service Details</h3>
          <p className="text-sm text-gray-600 mb-4">
            After selecting your plan, you'll be able to add details about your listing including photos, title, category, and description.
            The number of photos you can upload depends on your selected plan.
          </p>
        </div>
      ) : (
        <div className="mt-8 mb-10">
          <h3 className="text-xl font-semibold mb-4">Proceeding to Listing Details</h3>
          <p className="text-sm text-gray-600 mb-4">
            You've selected the {selectedPlan.name} plan. Scroll down to add details about your listing.
            With this plan, you can upload up to {selectedPlan.id === "basic" ? "5" : "10"} photos.
          </p>
          <div className="animate-pulse flex justify-center">
            <svg className="w-6 h-6 text-primaryA0" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex justify-start mt-6 sm:mt-8">
        <button
          onClick={handleBack}
          className="px-4 sm:px-6 py-3 border border-gray-300 rounded-md text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-all"
        >
          Back
        </button>
      </div>
      
      {!selectedPlan && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600">
            Select a plan to continue to listing details
          </p>
        </div>
      )}
    </div>
  );
};

PlanSelectionSection.propTypes = {
  selectedPlan: PropTypes.object,
  setSelectedPlan: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired
};

PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isPopular: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};

export default PlanSelectionSection; 
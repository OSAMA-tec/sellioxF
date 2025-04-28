import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BasicInfo from "../../Pages/AddListingPage/sections/BasicInfo.section";
import Location from "../../Pages/AddListingPage/sections/Location.section";
import Description from "../../Pages/AddListingPage/sections/Description.section";
import Photos from "../../Pages/AddListingPage/sections/Photos.section";
import Review from "../../Pages/AddListingPage/sections/Review.section";
import Pricing from "../../Pages/AddListingPage/sections/Pricing.section";

// Add Listing Form Steps
const STEPS = {
  BASIC_INFO: 0,
  LOCATION: 1,
  DESCRIPTION: 2,
  PHOTOS: 3,
  PRICING: 4,
  REVIEW: 5,
};

const AddListing = () => {
  const [step, setStep] = useState(STEPS.BASIC_INFO);

  // Initialize react-hook-form
  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      // Basic Info defaults
      title: "",
      category: "",
      subcategory: "",
      // Location defaults
      country: "",
      region: "",
      district: "",
      address: "",
      // Description defaults
      description: "",
      features: [],
      // Photos defaults
      photos: [],
      // Pricing defaults
      selectedPlan: null,
    },
  });

  // Navigation handlers
  const onNext = () => {
    setStep((prev) => prev + 1);
  };

  const onBack = () => {
    setStep((prev) => prev - 1);
  };

  // Determine which step to display
  const renderStep = () => {
    switch (step) {
      case STEPS.BASIC_INFO:
        return <BasicInfo onNext={onNext} />;
      case STEPS.LOCATION:
        return <Location onNext={onNext} onBack={onBack} />;
      case STEPS.DESCRIPTION:
        return <Description onNext={onNext} onBack={onBack} />;
      case STEPS.PHOTOS:
        return <Photos onNext={onNext} onBack={onBack} />;
      case STEPS.PRICING:
        return <Pricing onNext={onNext} onBack={onBack} />;
      case STEPS.REVIEW:
        return <Review onBack={onBack} />;
      default:
        return <BasicInfo onNext={onNext} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <FormProvider {...methods}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {step === STEPS.REVIEW ? "Review Your Listing" : "Add Your Listing"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Step {step + 1} of {Object.keys(STEPS).length}
          </p>
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${((step + 1) / Object.keys(STEPS).length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {renderStep()}
        </div>
      </FormProvider>
    </div>
  );
};

export default AddListing; 
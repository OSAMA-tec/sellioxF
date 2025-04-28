import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Listing from "./sections/Listing.section";
import PlanSelection from "./sections/PlanSelection.section";
import ListingDetails from "./sections/ListingDetails.section";
import PaymentWrapper from "./sections/PaymentWrapper";
import ConfirmationPageSection from "./sections/ConfirmationPage.section";
import { notifySuccess, notifyError } from "../../utils/toast";
import useAddListing from "../../utils/react-query-hooks/Listings/useAddListing";
import { useQueryClient } from "react-query";
import { useReferralNotifications } from "../../context/ReferralNotificationContext";
import useGetUserSubscriptions from "../../utils/react-query-hooks/Plans/useGetUserSubscriptions";
import { FaCheck, FaSpinner } from "react-icons/fa";

const steps = [
  { id: 1, name: "Business Details" },
  { id: 2, name: "Plans & Listing Details" },
  { id: 3, name: "Login/Signup" },
  { id: 4, name: "Payment" },
  { id: 5, name: "Confirmation" },
];

const AddListingPage = () => {
  const methods = useForm({
    mode: "onChange",
    watch: true,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      services: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      selectedPlan: null,
    },
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();
  const { simulateReferralNotification } = useReferralNotifications();

  // Check if user has existing subscriptions
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } = useGetUserSubscriptions(
    (data) => {
      console.log("User subscriptions:", data.data);
      // If user has subscriptions, we'll skip plan selection
      if (data.data.subscriptions && data.data.subscriptions.length > 0) {
        console.log("User has existing subscriptions, skipping plan selection");
        // Set the selected plan from the existing subscription
        if (data.data.subscriptions[0].plan) {
          setSelectedPlan(data.data.subscriptions[0].plan);
          methods.setValue("selectedPlan", data.data.subscriptions[0].plan);
        }
      }
    },
    (error) => {
      console.error("Error fetching user subscriptions:", error);
    },
  );

  // useVerifyToken();

  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitButtonClicked, setFormSubmitButtonClicked] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [hasExistingSubscription, setHasExistingSubscription] = useState(false);
  const [referralUsed, setReferralUsed] = useState(false);
  const [existingSubscription, setExistingSubscription] = useState(null);
  const [usedExistingSubscription, setUsedExistingSubscription] = useState(false);

  // Track the selected plan separately for easy access across components
  const [selectedPlan, setSelectedPlan] = useState(methods.getValues("selectedPlan") || null);

  // Determine if user has existing subscription based on API response
  useEffect(() => {
    if (subscriptionsData?.data?.subscriptions) {
      const hasSubscription = subscriptionsData.data.subscriptions.length > 0;
      setHasExistingSubscription(hasSubscription);

      if (hasSubscription && subscriptionsData.data.subscriptions[0]) {
        // Store the existing subscription data
        setExistingSubscription(subscriptionsData.data.subscriptions[0]);

        // Set the selected plan from the existing subscription
        if (subscriptionsData.data.subscriptions[0].planId) {
          setSelectedPlan(subscriptionsData.data.subscriptions[0].planId);
          methods.setValue("selectedPlan", subscriptionsData.data.subscriptions[0].planId);
        }
      }
    }
  }, [subscriptionsData, methods]);

  // React Query mutation for creating a listing
  const { mutate: createListing, isLoading: isCreatingListing } = useAddListing(
    (data) => {
      // On success
      setListingId(data.listing._id);
      notifySuccess("Listing created successfully!");
      // If we're at the photos step, move to payment
      if (currentStep === 3) {
        setCurrentStep(4);
      }
      // Invalidate listings cache to refresh data
      queryClient.invalidateQueries("userListings");
    },
    (error) => {
      // On error
      console.error("Error creating listing:", error);

      // Get detailed error message if available
      let errorMessage = "Failed to create listing. Please try again.";

      if (error.response) {
        // Server responded with an error
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;

          // If it's a validation error with details
          if (error.response.data.errors) {
            const errorDetails = error.response.data.errors;
            errorMessage +=
              ": " +
              Object.keys(errorDetails)
                .map((key) => `${key} ${errorDetails[key]}`)
                .join(", ");
          }
        }

        // Log detailed error for debugging
        console.error("API Error Details:", {
          status: error.response.status,
          data: error.response.data,
        });
      }

      notifyError(errorMessage);
    },
  );

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (currentStep > 1) {
      const data = methods.getValues();
      localStorage.setItem("listingFormData", JSON.stringify(data));
    }
  }, [currentStep, methods]);

  // Load form data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem("listingFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        methods.setValue(key, parsedData[key]);
      });

      // If a plan was previously selected, restore it
      if (parsedData.selectedPlan) {
        setSelectedPlan(parsedData.selectedPlan);
      }
    }
  }, [methods]);

  // Check if user is logged in when on login step
  useEffect(() => {
    // If user navigates to step 3 (login) but is already logged in,
    // automatically redirect to step 4 (payment)
    if (currentStep === 3 && user) {
      setCurrentStep(4);
    }
  }, [currentStep, user]);

  // Go to the next step
  const handleNext = () => {
    // Save form data to localStorage
    localStorage.setItem("listingFormData", JSON.stringify(methods.getValues()));

    // Reset subStep when moving to a new main step
    if (Math.floor(currentStep) !== Math.floor(currentStep + 1)) {
      methods.setValue("subStep", 1);
    }

    // If user already has a subscription and we're at step 1,
    // proceed to step 2 but show their current plan details
    if (currentStep === 1 && hasExistingSubscription) {
      setCurrentStep(2);
      return;
    }

    // If user is already logged in and we're at step 2, go to step 4 (payment)
    if (currentStep === 2 && user) {
      setCurrentStep(4);
      return;
    }

    setCurrentStep((prevStep) => Math.floor(prevStep) + 1);
  };

  // Go to the previous step
  const handleBack = () => {
    // If we're at the payment step and user has a subscription,
    // go back to business details (skip the plan selection)
    if (currentStep === 4 && hasExistingSubscription) {
      setCurrentStep(1);
      return;
    }

    // Reset subStep when moving to a new main step
    if (Math.floor(currentStep) !== Math.floor(currentStep - 1)) {
      // Set to the last sub-step of the previous step
      methods.setValue("subStep", 3);
    }

    setCurrentStep((prevStep) => Math.floor(prevStep) - 1);
  };

  // Update form data when plan changes
  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    methods.setValue("selectedPlan", plan);
  };

  // Handle completion of the entire process
  const handlePaymentComplete = (paymentId, paymentSuccess = true) => {
    // Check if payment was made with a referral code
    const usedReferralCode = localStorage.getItem("usedReferralCode");
    const wasReferralApplied = !!usedReferralCode;

    // Update states for confirmation page
    setReferralUsed(wasReferralApplied);
    setUsedExistingSubscription(!paymentSuccess || paymentId === "using_existing_subscription");

    // Get all form data
    const formValues = methods.getValues();

    // Ensure required fields are present
    if (!formValues.title) {
      notifyError("Listing title is required");
      return;
    }

    // Extract photos from form data
    const photos = formValues.photos || [];

    // Prepare services array (if it exists)
    const services = formValues.services ? (Array.isArray(formValues.services) ? formValues.services : [formValues.services]) : [];

    // Get the correct plan ID based on whether user has existing subscription
    const planId = hasExistingSubscription ? existingSubscription?.planId?._id : selectedPlan?._id || formValues.selectedPlan?._id;

    if (!planId) {
      notifyError("Plan selection is required");
      return;
    }

    // Prepare submission data with required fields explicitly defined
    const submissionData = {
      businessTitle: formValues.title || "",
      serviceTitle: formValues.title || "",
      businessEmailAddress: formValues.contactEmail || "",
      businessInfo: formValues.description || "",
      serviceDescription: formValues.description || "",
      serviceCategory: formValues.category || "",
      servicePlan: planId,
      location: formValues.location || "",
      paymentId,
      isUsingExistingSubscription: !paymentSuccess || paymentId === "using_existing_subscription",
      // Pass the photos array (the useAddListing hook will process this into serviceImages)
      photos: photos,
      // Add services array if it exists
      services: services,
      // Include other form data
      ...formValues,
    };

    console.log("Submitting listing data:", submissionData);

    try {
      // Call the API to create the listing
      createListing(submissionData);

      // Move to confirmation page only after successful API call
      setCurrentStep(5);

      // Clear stored form data after successful submission
      localStorage.removeItem("listingFormData");

      // If this was a listing with a referral code, credit the referrer with 5 tickets
      if (wasReferralApplied) {
        // In a real implementation, this would be an API call to credit the referrer
        console.log(`Crediting referrer of code ${usedReferralCode} with 5 tickets`);

        // Trigger a notification for the referrer about earning 5 tickets
        simulateReferralNotification("listing");

        // Clear the used referral code from localStorage
        localStorage.removeItem("usedReferralCode");
      }
    } catch (error) {
      console.error("Error submitting listing:", error);
      notifyError("Failed to create your listing. Please try again.");
    }
  };

  // Show loading state while checking subscriptions
  if (isLoadingSubscriptions && user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-primaryA0 text-3xl mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading your account information...</h2>
        <p className="text-gray-500 mt-2">Please wait while we check your subscription status.</p>
      </div>
    );
  }

  const renderStepContent = (step) => {
    let subStep;

    switch (step) {
      case 1:
        return <Listing methods={methods} handleNext={handleNext} />;
      case 2:
        // Plans & Listing Details step now has two sub-steps
        subStep = methods.getValues("subStep") || 1;

        // If user has existing subscription, show their current plan in read-only mode
        if (subStep === 1) {
          return (
            <PlanSelection
              selectedPlan={selectedPlan}
              setSelectedPlan={(plan) => {
                handlePlanChange(plan);
                // Automatically move to listing details when plan is selected
                if (plan) {
                  methods.setValue("subStep", 2);
                }
              }}
              handleBack={handleBack}
              hasExistingSubscription={hasExistingSubscription}
              existingSubscription={existingSubscription}
            />
          );
        } else {
          return (
            <ListingDetails
              handleBack={() => {
                // Go back to plan selection
                methods.setValue("subStep", 1);
                setCurrentStep(2.1);
              }}
              handleChangePlan={() => {
                // Go back to plan selection to change plan
                methods.setValue("subStep", 1);
                setCurrentStep(2.1);
              }}
              handleNext={handleNext}
              methods={methods}
              selectedPlan={selectedPlan}
              hasExistingSubscription={hasExistingSubscription}
            />
          );
        }
      case 3:
        // If user is already logged in, show loading and redirect to payment step
        if (user) {
          // Show loading indicator while redirecting
          return (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-pulse h-10 w-10 bg-primaryA0 rounded-full mb-4"></div>
              <p className="text-gray-600">Already logged in, redirecting to payment...</p>
            </div>
          );
        }

        return (
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Login or Create an Account</h2>
              <p className="text-gray-600 mb-6">Please log in or create an account to continue with your listing</p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigate("/auth/login", { state: { returnTo: "/addList", listingData: true } })}
                  className="px-4 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register", { state: { returnTo: "/addList", listingData: true } })}
                  className="px-4 py-2 bg-white border border-primaryA0 text-primaryA0 rounded-md hover:bg-gray-50 transition-all"
                >
                  Create Account
                </button>
                <p className="text-sm text-gray-500 mt-2">Note: You can add your referral code at checkout after signing up.</p>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <PaymentWrapper
            onPaymentComplete={handlePaymentComplete}
            handleBack={handleBack}
            formSubmitButtonClicked={formSubmitButtonClicked}
            setFormSubmitButtonClicked={setFormSubmitButtonClicked}
            selectedPlan={selectedPlan}
            isCreatingListing={isCreatingListing}
            hasExistingSubscription={hasExistingSubscription}
          />
        );
      case 5:
        return (
          <ConfirmationPageSection referralUsed={referralUsed} listingId={listingId} usingExistingSubscription={usedExistingSubscription} />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <MainNavbar /> */}
      <div className="py-6 sm:py-10 flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FormProvider {...methods}>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">Add Your Listing</h1>
                <p className="text-sm sm:text-base text-gray-600">Complete the form below to add your listing to our marketplace</p>
              </div>

              {/* Step indicators */}
              <div className="mb-8 sm:mb-10">
                <nav aria-label="Progress">
                  {/* Desktop step indicators */}
                  <ol className="hidden md:flex items-center justify-between">
                    {steps.map((step, index) => (
                      <li key={step.id} className={`relative ${index < steps.length - 1 ? "flex-1" : ""}`}>
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
                            ${
                              currentStep === step.id
                                ? "bg-primaryA0 text-white ring-2 ring-primaryA0/30"
                                : currentStep > step.id
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-500 border border-gray-300"
                            }`}
                          >
                            {currentStep > step.id ? <FaCheck className="w-4 h-4" /> : step.id}
                          </div>
                          <span
                            className={`ml-3 text-sm font-medium ${currentStep === step.id ? "text-primaryA0" : currentStep > step.id ? "text-green-500" : "text-gray-500"}`}
                          >
                            {step.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* Mobile step indicators - improved version */}
                  <div className="md:hidden">
                    <div className="flex justify-between mb-4">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`flex flex-col items-center ${currentStep === step.id ? "opacity-100" : "opacity-70"}`}
                        >
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold mb-1
                            ${
                              currentStep === step.id
                                ? "bg-primaryA0 text-white ring-2 ring-primaryA0/30"
                                : currentStep > step.id
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-500 border border-gray-300"
                            }`}
                          >
                            {currentStep > step.id ? <FaCheck className="w-3 h-3" /> : step.id}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between bg-gray-100 h-1 rounded-full mb-2">
                      {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                          <div
                            className={`h-1 rounded-full ${currentStep >= step.id ? "bg-primaryA0" : "bg-gray-100"}`}
                            style={{ width: `${100 / (steps.length - 1)}%` }}
                          />
                          {index < steps.length - 1 && (
                            <div
                              className={`h-1 rounded-full ${currentStep > step.id ? "bg-primaryA0" : "bg-gray-100"}`}
                              style={{ width: `${100 / (steps.length - 1)}%` }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="text-center">
                      <span
                        className={`text-sm font-medium ${currentStep === steps[currentStep - 1].id ? "text-primaryA0" : "text-gray-700"}`}
                      >
                        Step {currentStep}: {steps[currentStep - 1].name}
                      </span>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Step content */}
              <div className="mt-6">{renderStepContent(currentStep)}</div>
            </div>
          </FormProvider>
        </div>
      </div>
      {/* <FooterComponent /> */}
    </div>
  );
};

export default AddListingPage;

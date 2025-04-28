import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { FaSpinner, FaArrowLeft, FaLock, FaTicketAlt, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../../../config";

const PaymentFormSection = ({
  onPaymentComplete,
  handleBack,
  formSubmitButtonClicked,
  setFormSubmitButtonClicked,
  selectedPlan,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { getValues } = useFormContext();
  const navigate = useNavigate();
  
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      city: "",
      postal_code: "",
      country: "",
    },
  });
  
  // State for referral code
  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState({
    isValid: false,
    message: "",
    loading: false,
    checked: false,
    benefit: null, // 'free_month' or 'draw_tickets'
  });
  
  // Calculate order summary based on selected plan and referral code
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  // Update order summary when plan or referral status changes
  useEffect(() => {
    if (selectedPlan) {
      const subtotal = selectedPlan.price;
      let discount = 0;
      
      // Apply discount if referral code is valid and benefit is free_month
      if (referralStatus.isValid && referralStatus.benefit === 'free_month') {
        // Calculate one month discount (assuming monthly billing)
        discount = subtotal;
      }
      
      const total = Math.max(0, subtotal - discount);
      
      setOrderSummary({
        subtotal,
        discount,
        total,
      });
    }
  }, [selectedPlan, referralStatus]);
  
  // Get client secret from backend when component mounts
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!selectedPlan) return;
      
      try {
        setProcessing(true);
        // Include referral code if it's valid
        const payload = {
          planId: selectedPlan.id,
          amount: orderSummary.total * 100, // Stripe uses cents
        };
        
        if (referralStatus.isValid && referralCode) {
          payload.referralCode = referralCode;
          payload.referralBenefit = referralStatus.benefit;
        }
        
        // In a real implementation, this would be an API call
        // For demo purposes, simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock client secret for demo
        setClientSecret("mock_client_secret_" + Date.now());
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setPaymentError(
          error.response?.data?.message || 
          "Unable to process payment. Please try again."
        );
      } finally {
        setProcessing(false);
      }
    };

    if (selectedPlan && orderSummary.total > 0) {
      fetchPaymentIntent();
    } else {
      // Reset processing state if we're not fetching a payment intent
      setProcessing(false);
    }
  }, [selectedPlan, orderSummary.total, referralStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBillingDetails({
        ...billingDetails,
        [parent]: {
          ...billingDetails[parent],
          [child]: value,
        },
      });
    } else {
      setBillingDetails({
        ...billingDetails,
        [name]: value,
      });
    }
  };

  // Verify referral code
  const verifyReferralCode = async () => {
    if (!referralCode.trim()) {
      setReferralStatus({
        isValid: false,
        message: "Please enter a referral code",
        loading: false,
        checked: true,
        benefit: null,
      });
      return;
    }

    setReferralStatus({
      ...referralStatus,
      loading: true,
      checked: false,
    });

    try {
      // In a real implementation, this would be an API call
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, consider any code with at least 5 characters valid
      const isValid = referralCode.trim().length >= 5;

      // For this implementation, always give free month (not draw tickets)
      const benefit = "free_month";

      setReferralStatus({
        isValid,
        message: isValid
          ? "Valid code! Your listing will be free for the first month."
          : "Invalid referral code. Please try again.",
        loading: false,
        checked: true,
        benefit: isValid ? benefit : null,
      });

      // If valid, update the order summary immediately
      if (isValid && selectedPlan) {
        const subtotal = selectedPlan.price || 0;
        setOrderSummary({
          subtotal,
          discount: subtotal, // Full discount
          total: 0, // Free
        });
      }
    } catch (error) {
      console.error("Error verifying referral code:", error);
      setReferralStatus({
        isValid: false,
        message: "Error verifying code. Please try again.",
        loading: false,
        checked: true,
        benefit: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formSubmitButtonClicked) return;
    setFormSubmitButtonClicked(true);
    setProcessing(true);

    try {
      // Get form values from the parent form
      const formValues = getValues();

      // Check if order is free due to referral code
      if (
        referralStatus.isValid &&
        referralStatus.benefit === "free_month" &&
        orderSummary.total === 0
      ) {
        try {
          // In a real implementation, this would be an API call to create the listing without payment
          // Simulate API call with timeout
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Store the referral code in local storage to credit the referrer with 5 tickets
          if (referralCode) {
            localStorage.setItem("usedReferralCode", referralCode);
          }

          setPaymentSuccess(true);
          setPaymentError(null);

          // Pass a dummy payment ID to the parent component
          onPaymentComplete("free_listing_with_referral");

          // Navigate to success page
          navigate("/payment-success");
          return;
        } catch (err) {
          console.error("Free listing error:", err);
          throw new Error("An unexpected error occurred with the free listing. Please try again.");
        }
      }

      // Regular payment flow if not free
      if (!stripe || !elements) {
        throw new Error("Stripe has not initialized. Please try again.");
      }
      
      // Use the form values for contactName and contactEmail if they exist,
      // otherwise use the values from the billing details
      const cardholderDetails = {
        name: formValues.contactName || billingDetails.name,
        email: formValues.contactEmail || billingDetails.email,
        address: billingDetails.address,
      };

      // In a real implementation, this would be a Stripe API call
      // For demo purposes, simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store the referral code in local storage if it was used
      if (referralCode && referralCode.trim()) {
        localStorage.setItem("usedReferralCode", referralCode);
      }
      
      // Set payment as successful
      setPaymentSuccess(true);
      setPaymentError(null);
      
      // Call the parent component's onPaymentComplete callback
      // This will move to the confirmation page within the listing flow (step 5)
      onPaymentComplete("demo_payment_" + Date.now());
      
      // No redirect to separate payment success page
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
      setFormSubmitButtonClicked(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const handleBackClick = () => {
    handleBack();
  };

  return (
    <div className="w-full px-4 sm:px-0 sm:max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Payment Information</h2>

      {/* Order Summary */}
      <div className="bg-white p-4 sm:p-5 border rounded-lg shadow-sm mb-4 sm:mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Order Summary</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">{selectedPlan?.name || "Standard"}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span>${orderSummary.subtotal.toFixed(2)}</span>
          </div>
          
          {orderSummary.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount (Referral):</span>
              <span>-${orderSummary.discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 mt-2">
            <span>Total:</span>
            <span className={orderSummary.total === 0 ? "text-green-600 font-bold" : ""}>
              ${orderSummary.total.toFixed(2)}
              {orderSummary.total === 0 && " (FREE)"}
            </span>
          </div>
        </div>
        
        {orderSummary.total === 0 && referralStatus.isValid && (
          <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-md text-sm text-green-700">
            Your first month is free thanks to the referral code!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Referral Code Section */}
        <div className="bg-white p-4 sm:p-5 border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Referral Code</h3>
          
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FaTicketAlt size={16} />
                  </div>
                  <input
                    type="text"
                    className="w-full py-2 pl-10 pr-20 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 focus:outline-none transition-colors"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    disabled={referralStatus.isValid || processing}
                  />
                  {referralStatus.loading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaSpinner className="animate-spin text-gray-400" size={16} />
                    </div>
                  )}
                  {referralStatus.isValid && !referralStatus.loading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaCheckCircle className="text-green-500" size={16} />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={verifyReferralCode}
                  disabled={!referralCode.trim() || referralStatus.loading || referralStatus.isValid || processing}
                  className={`px-4 py-2 rounded-md ${
                    !referralCode.trim() || referralStatus.loading || referralStatus.isValid || processing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primaryA0 text-white hover:bg-primaryA0/90"
                  }`}
                >
                  {referralStatus.loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : referralStatus.isValid ? (
                    'Verified'
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {referralStatus.checked && (
            <div className={`text-sm ${referralStatus.isValid ? 'text-green-600' : 'text-red-500'} mt-1`}>
              {referralStatus.message}
            </div>
          )}
          
          {/* Referral Program Information */}
          <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-blue-700">
              Get your first month <strong>FREE</strong> with a valid referral code
            </p>
          </div>
        </div>

        {/* Payment Details - Only show if not free */}
        {orderSummary.total > 0 && (
          <div className="bg-white p-4 sm:p-5 border rounded-lg shadow-sm">
            <div className="mb-4 flex items-center">
              <FaLock className="text-gray-500 mr-2" />
              <span className="text-xs sm:text-sm text-gray-600">
                Secure payment processing by Stripe
              </span>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Details
              </label>
              <div className="border border-gray-300 p-3 rounded-md">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            {paymentError && (
              <div className="text-red-500 text-xs sm:text-sm mb-4 p-2 bg-red-50 rounded-md">
                {paymentError}
              </div>
            )}

            {paymentSuccess && (
              <div className="text-green-500 text-xs sm:text-sm mb-4 p-2 bg-green-50 rounded-md">
                Payment processed successfully!
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={handleBackClick}
            disabled={processing}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-gray-700 border border-gray-300 rounded-lg transition-colors ${
              processing 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-gray-50"
            }`}
          >
            <FaArrowLeft className="text-xs sm:text-sm" /> <span>Back</span>
          </button>
          
          <button
            type="submit"
            disabled={processing || formSubmitButtonClicked || (orderSummary.total > 0 && (!stripe || !elements))}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-white rounded-lg transition-colors ${
              processing || formSubmitButtonClicked || (orderSummary.total > 0 && (!stripe || !elements))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primaryA0 hover:bg-primaryA0/90"
            }`}
          >
            {processing || formSubmitButtonClicked ? (
              <>
                <FaSpinner className="animate-spin text-xs sm:text-sm" /> <span>Processing...</span>
              </>
            ) : (
              orderSummary.total === 0 && referralStatus.isValid ? "Create Listing (Free)" : "Pay Now"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

PaymentFormSection.propTypes = {
  onPaymentComplete: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  formSubmitButtonClicked: PropTypes.bool.isRequired,
  setFormSubmitButtonClicked: PropTypes.func.isRequired,
  selectedPlan: PropTypes.object,
};

export default PaymentFormSection;

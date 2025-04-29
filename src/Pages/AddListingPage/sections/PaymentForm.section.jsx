import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaSpinner, FaArrowLeft, FaLock, FaTicketAlt, FaCheckCircle, FaIdCard } from "react-icons/fa";
import useCreatePaymentIntent from "../../../utils/react-query-hooks/Payment/useCreatePaymentIntent";
import useConfirmPayment from "../../../utils/react-query-hooks/Payment/useConfirmPayment";

// Define a list of common countries
const COUNTRIES = [
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
];

const PaymentFormSection = ({
  onPaymentComplete,
  handleBack,
  formSubmitButtonClicked,
  setFormSubmitButtonClicked,
  selectedPlan,
  isCreatingListing,
  hasExistingSubscription = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { getValues } = useFormContext();

  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  // Determine if we're in any loading state
  const isLoading = processing || formSubmitButtonClicked || isCreatingListing;

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      city: "",
      postal_code: "",
      country: "NZ", // Default to New Zealand
    },
  });

  // State for referral code
  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState({
    isValid: false,
    message: "",
    loading: false,
    checked: false,
    benefit: null /* free_month or draw_tickets */,
  });

  // Calculate order summary based on selected plan and referral code
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  // Skip payment intent fetching if user already has a subscription
  const shouldSkipPayment = hasExistingSubscription;

  // React Query Hooks for Payment Intent Creation and Confirmation
  const { mutate: createPaymentIntent, isLoading: isCreatingPaymentIntent } = useCreatePaymentIntent(
    // On success
    (response) => {
      const { clientSecret, paymentIntentId } = response.data;
      setClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
      setPaymentError(null);
      setProcessing(false);
    },
    // On error
    (error) => {
      console.error("Error creating payment intent:", error);
      setPaymentError(error.response?.data?.message || "Unable to process payment. Please try again.");
      setProcessing(false);
    },
  );

  const { mutate: confirmPaymentOnServer, isLoading: isConfirmingPayment } = useConfirmPayment(
    // On success
    () => {
      setPaymentSuccess(true);
      setPaymentError(null);
      // Call the parent component's onPaymentComplete callback with the payment ID
      onPaymentComplete(paymentIntentId);
    },
    // On error
    (error) => {
      console.error("Error confirming payment:", error);
      setPaymentError(error.response?.data?.message || "Payment verification failed. Please contact support.");
      setProcessing(false);
      setFormSubmitButtonClicked(false);
    },
  );

  // Update order summary when plan or referral status changes
  useEffect(() => {
    if (selectedPlan && !shouldSkipPayment) {
      const subtotal = selectedPlan.planPrice || selectedPlan.price || 0;
      let discount = 0;

      // Apply discount if referral code is valid and benefit is free_month
      if (referralStatus.isValid && referralStatus.benefit === "free_month") {
        // Calculate one month discount (assuming monthly billing)
        discount = subtotal;
      }

      const total = Math.max(0, subtotal - discount);

      setOrderSummary({
        subtotal,
        discount,
        total,
      });
    } else if (shouldSkipPayment) {
      // If using existing subscription, set total to 0
      setOrderSummary({
        subtotal: 0,
        discount: 0,
        total: 0,
      });
    }
  }, [selectedPlan, referralStatus, shouldSkipPayment]);

  // Create payment intent when plan is selected and amount is known
  const handleCreatePaymentIntent = () => {
    if (!selectedPlan || shouldSkipPayment || orderSummary.total === 0) return;

    setProcessing(true);

    // Prepare payload for payment intent creation
    const payload = {
      planId: selectedPlan._id || selectedPlan.id,
      // Add referral code if valid
      ...(referralStatus.isValid && referralCode ? { referralCode } : {}),
    };

    // Call the API to create a payment intent
    createPaymentIntent(payload);
  };

  // Call handleCreatePaymentIntent when plan changes or when total changes
  useEffect(() => {
    // Only create payment intent if we have a valid plan with price > 0
    if (selectedPlan && orderSummary.total > 0 && !shouldSkipPayment) {
      handleCreatePaymentIntent();
    } else {
      // Reset processing state if we're not creating a payment intent
      setProcessing(false);
    }
  }, [selectedPlan?._id, orderSummary.total, referralStatus.isValid]);

  const handleBillingDetailsChange = (e) => {
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
        message: isValid ? "Valid code! Your listing will be free for the first month." : "Invalid referral code. Please try again.",
        loading: false,
        checked: true,
        benefit: isValid ? benefit : null,
      });

      // If valid, update the order summary immediately
      if (isValid && selectedPlan && !shouldSkipPayment) {
        const subtotal = selectedPlan.planPrice || selectedPlan.price || 0;
        setOrderSummary({
          subtotal,
          discount: subtotal /* Full discount */,
          total: 0 /* Free */,
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

    if (isLoading) return;
    setFormSubmitButtonClicked(true);
    setProcessing(true);

    try {
      // Get form values from the parent form
      const formValues = getValues();

      // If using existing subscription, skip payment and create listing directly
      if (shouldSkipPayment) {
        try {
          // Simulate API call with timeout
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setPaymentSuccess(true);
          setPaymentError(null);

          // Pass a specific code for existing subscription
          onPaymentComplete("using_existing_subscription", false); // Pass false to indicate no real payment occurred
          return;
        } catch (err) {
          console.error("Error processing with existing subscription:", err);
          throw new Error("An unexpected error occurred. Please try again or contact support.");
        }
      }

      // Check if order is free due to referral code
      if (referralStatus.isValid && referralStatus.benefit === "free_month" && orderSummary.total === 0) {
        try {
          // In a real implementation, this would be an API call to create the listing without payment
          // Create a payment intent with $0 amount
          handleCreatePaymentIntent();

          // Store the referral code in local storage to credit the referrer with 5 tickets
          if (referralCode) {
            localStorage.setItem("usedReferralCode", referralCode);
          }

          setPaymentSuccess(true);
          setPaymentError(null);

          // Pass a dummy payment ID to the parent component
          onPaymentComplete("free_listing_with_referral");
          return;
        } catch (err) {
          console.error("Free listing error:", err);
          throw new Error("An unexpected error occurred with the free listing. Please try again.");
        }
      }

      // Regular payment flow if not free
      if (!stripe || !elements || !clientSecret) {
        throw new Error("Payment system is not initialized. Please try again or contact support.");
      }

      // Use the card element to create a payment method
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card information is required.");
      }

      // Ensure we have a valid address with non-empty country before sending to Stripe
      const address = { ...billingDetails.address };

      // Make sure the country is valid - Stripe doesn't accept empty string values
      if (!address.country) {
        address.country = "NZ"; // Default to New Zealand if missing
      }

      // Use the form values for contactName and contactEmail if they exist,
      // otherwise use the values from the billing details
      const cardholderDetails = {
        name: formValues.contactName || billingDetails.name,
        email: formValues.contactEmail || billingDetails.email,
        address: address,
      };

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: cardholderDetails,
        },
      });

      if (stripeError) {
        // Handle Stripe errors
        console.error("Stripe payment error:", stripeError);
        throw new Error(stripeError.message || "Payment failed. Please try a different card or try again later.");
      }

      if (paymentIntent.status === "succeeded") {
        // Payment succeeded, now confirm on our server
        confirmPaymentOnServer({ paymentIntentId: paymentIntentId });
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}. Please try again or contact support.`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "An unexpected error occurred. Please try again.");
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

  // Get loading/processing message based on state
  const getProcessingMessage = () => {
    if (isCreatingListing) return "Creating listing...";
    if (isConfirmingPayment) return "Confirming payment...";
    if (isCreatingPaymentIntent) return "Preparing payment...";
    if (processing) return "Processing payment...";
    return "Processing...";
  };

  return (
    <div className="w-full px-4 sm:px-0 sm:max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Payment Information</h2>

      {/* Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium">Payment Error</p>
              <p className="text-sm">{paymentError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Existing Subscription Message */}
      {shouldSkipPayment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 text-center">
          <div className="flex justify-center mb-3">
            <FaIdCard className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Using Your Existing Subscription</h3>
          <p className="text-blue-700 mb-4">You already have an active subscription.</p>
          <div className="text-sm text-blue-600">Click the &quot;Create Listing&quot; button below to continue.</div>
        </div>
      )}

      {/* Order Summary - Only show if not using existing subscription */}
      {!shouldSkipPayment && (
        <div className="bg-white p-4 sm:p-5 border rounded-lg shadow-sm mb-4 sm:mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Order Summary</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{selectedPlan?.planType || selectedPlan?.name || "Standard"}</span>
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
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Referral Code Section - Only show if not using existing subscription */}
        {!shouldSkipPayment && (
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
                      disabled={referralStatus.isValid || isLoading}
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
                    disabled={!referralCode.trim() || referralStatus.loading || referralStatus.isValid || isLoading}
                    className={`px-4 py-2 rounded-md ${
                      !referralCode.trim() || referralStatus.loading || referralStatus.isValid || isLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primaryA0 text-white hover:bg-primaryA0/90"
                    }`}
                  >
                    {referralStatus.loading ? <FaSpinner className="animate-spin" /> : referralStatus.isValid ? "Verified" : "Apply"}
                  </button>
                </div>
              </div>
            </div>

            {referralStatus.checked && (
              <div className={`text-sm ${referralStatus.isValid ? "text-green-600" : "text-red-500"} mt-1`}>{referralStatus.message}</div>
            )}

            {/* Referral Program Information */}
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700">
                Get your first month <strong>FREE</strong> with a valid referral code
              </p>
            </div>
          </div>
        )}

        {/* Payment Details - Only show if not free and not using existing subscription */}
        {orderSummary.total > 0 && !shouldSkipPayment && (
          <div className="bg-white p-4 sm:p-5 border rounded-lg shadow-sm">
            <div className="mb-4 flex items-center">
              <FaLock className="text-gray-500 mr-2" />
              <span className="text-xs sm:text-sm text-gray-600">Secure payment processing by Stripe</span>
            </div>

            {/* Billing Details */}
            <div className="mb-4 space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0"
                  value={billingDetails.name}
                  onChange={handleBillingDetailsChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0"
                  value={billingDetails.email}
                  onChange={handleBillingDetailsChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Billing Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address.line1"
                    name="address.line1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0"
                    value={billingDetails.address.line1}
                    onChange={handleBillingDetailsChange}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0"
                    value={billingDetails.address.city}
                    onChange={handleBillingDetailsChange}
                    placeholder="Auckland"
                  />
                </div>
                <div>
                  <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="address.postal_code"
                    name="address.postal_code"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0"
                    value={billingDetails.address.postal_code}
                    onChange={handleBillingDetailsChange}
                    placeholder="1010"
                  />
                </div>
                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="address.country"
                    name="address.country"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primaryA0 focus:border-primaryA0"
                    value={billingDetails.address.country}
                    onChange={handleBillingDetailsChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
              <div className="border border-gray-300 p-3 rounded-md">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            {paymentSuccess && (
              <div className="text-green-500 text-xs sm:text-sm mb-4 p-2 bg-green-50 rounded-md">Payment processed successfully!</div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={handleBackClick}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-gray-700 border border-gray-300 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xs sm:text-sm" /> <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || (!shouldSkipPayment && orderSummary.total > 0 && (!stripe || !elements || !clientSecret))}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-white bg-primaryA0 rounded-lg hover:bg-primaryA0/90 transition-colors"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-xs sm:text-sm" />
                <span>{getProcessingMessage()}</span>
              </>
            ) : shouldSkipPayment ? (
              "Create Listing"
            ) : orderSummary.total === 0 && referralStatus.isValid ? (
              "Create Listing (Free)"
            ) : (
              "Pay Now"
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
  isCreatingListing: PropTypes.bool,
  hasExistingSubscription: PropTypes.bool,
};

export default PaymentFormSection;

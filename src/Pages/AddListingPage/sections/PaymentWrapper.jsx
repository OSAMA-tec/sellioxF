import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentFormSection from "./PaymentForm.section";
import { STRIPE_PUBLIC_KEY } from "../../../config/constants";

// Initialize Stripe with your public key
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentWrapper = ({
  onPaymentComplete,
  handleBack,
  formSubmitButtonClicked,
  setFormSubmitButtonClicked,
  selectedPlan,
  isCreatingListing,
  hasExistingSubscription,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl font-semibold mb-6">Payment Information</h2>

          {/* Stripe Elements must be wrapped in the Elements provider */}
          <Elements stripe={stripePromise}>
            <PaymentFormSection
              onPaymentComplete={onPaymentComplete}
              handleBack={handleBack}
              formSubmitButtonClicked={formSubmitButtonClicked}
              setFormSubmitButtonClicked={setFormSubmitButtonClicked}
              selectedPlan={selectedPlan}
              isCreatingListing={isCreatingListing}
              hasExistingSubscription={hasExistingSubscription}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

PaymentWrapper.propTypes = {
  onPaymentComplete: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  formSubmitButtonClicked: PropTypes.bool.isRequired,
  setFormSubmitButtonClicked: PropTypes.func.isRequired,
  selectedPlan: PropTypes.object,
  isCreatingListing: PropTypes.bool,
  hasExistingSubscription: PropTypes.bool,
};

export default PaymentWrapper;

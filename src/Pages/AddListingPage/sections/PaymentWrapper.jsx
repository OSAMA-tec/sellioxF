import React from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentFormSection from "./PaymentForm.section";
import config from "../../../config";
// Initialize Stripe outside of component (singleton pattern)
const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

const PaymentWrapper = ({
  onPaymentComplete,
  handleBack,
  formSubmitButtonClicked,
  setFormSubmitButtonClicked,
  selectedPlan,
}) => {
  const stripeOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6663FD',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <PaymentFormSection
        onPaymentComplete={onPaymentComplete}
        handleBack={handleBack}
        formSubmitButtonClicked={formSubmitButtonClicked}
        setFormSubmitButtonClicked={setFormSubmitButtonClicked}
        selectedPlan={selectedPlan}
      />
    </Elements>
  );
};

PaymentWrapper.propTypes = {
  onPaymentComplete: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  formSubmitButtonClicked: PropTypes.bool.isRequired,
  setFormSubmitButtonClicked: PropTypes.func.isRequired,
  selectedPlan: PropTypes.object,
};

export default PaymentWrapper; 
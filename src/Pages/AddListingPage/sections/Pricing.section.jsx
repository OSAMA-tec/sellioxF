import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import PlanSelectionSection from "./PlanSelection.section";

const Pricing = ({ onNext, onBack }) => {
  // Get the form methods
  const { getValues, setValue, watch } = useFormContext();

  // Get the initial selected plan from form
  const [selectedPlan, setSelectedPlan] = useState(getValues("selectedPlan") || null);

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setValue("selectedPlan", plan);
  };

  // Handle submit and move to next step
  const onSubmit = () => {
    if (selectedPlan) {
      onNext();
    } else {
      // Show error message or validation feedback
      console.error("Please select a plan before proceeding");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 md:py-10 bg-white rounded-lg shadow-sm">
      <PlanSelectionSection
        selectedPlan={selectedPlan}
        setSelectedPlan={handlePlanSelect}
        handleNext={onSubmit}
        handleBack={onBack}
      />
    </div>
  );
};

Pricing.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Pricing; 
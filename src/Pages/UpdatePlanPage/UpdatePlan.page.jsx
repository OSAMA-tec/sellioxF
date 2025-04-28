import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import useUpdateListingPlan from '../../utils/react-query-hooks/Listings/useUpdateListingPlan';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import PlanCard from './components/PlanCard';
import PaymentSection from './components/PaymentSection';

export default function UpdatePlanPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [step, setStep] = useState(1);
  
  const updatePlan = useUpdateListingPlan({
    onSuccess: () => {
      toast.success('Plan updated successfully');
      navigate('/mylistings/mylistings');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update plan');
    }
  });
  
  useEffect(() => {
    const fetchListingAndPlans = async () => {
      try {
        setIsLoading(true);
        
        // Fetch listing details
        const listingResponse = await axiosInstance.get(`/listing/${listingId}`);
        setListing(listingResponse.data.listing);
        
        // Fetch available plans
        const plansResponse = await axiosInstance.get('/plan/all');
        setPlans(plansResponse.data.plans);
        
        // Fetch user's payment methods
        const paymentResponse = await axiosInstance.get('/credit/all');
        setPaymentMethods(paymentResponse.data.cards || []);
        
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load data');
        navigate('/mylistings/mylistings');
      }
    };
    
    fetchListingAndPlans();
  }, [listingId, navigate]);
  
  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setStep(2);
  };
  
  const handlePaymentSelection = (paymentId) => {
    setSelectedPaymentMethod(paymentId);
  };
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/mylistings/mylistings');
    }
  };
  
  const handleSubmit = () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      toast.error('Please select a plan and payment method');
      return;
    }
    
    updatePlan.mutate({
      listingId,
      planData: {
        planId: selectedPlan._id,
        paymentId: selectedPaymentMethod
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Update Subscription Plan</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Listing details */}
        <div className="mb-6 pb-4 border-b">
          <h2 className="text-lg font-semibold mb-2">{listing.serviceTitle}</h2>
          <div className="flex items-center text-sm text-gray-600">
            <span className="bg-primaryA0/10 text-primaryA0 px-2 py-1 rounded-full text-xs capitalize">
              {listing.plan?.planType || 'Basic'}
            </span>
            <span className="mx-2">•</span>
            <span>Current Plan</span>
          </div>
        </div>
        
        {step === 1 ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Choose a New Plan</h3>
            <p className="text-gray-600 mb-6">
              Select a plan that best suits your business needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  isCurrentPlan={listing.plan?._id === plan._id}
                  onSelect={handlePlanSelection}
                  disabled={updatePlan.isLoading}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
            <p className="text-gray-600 mb-6">
              Select a payment method for your subscription.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium">Selected Plan</h4>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <span className="text-lg font-medium capitalize">{selectedPlan.planType}</span>
                  <p className="text-sm text-gray-600">
                    {selectedPlan.features.slice(0, 2).join(' • ')}
                  </p>
                </div>
                <div className="text-lg font-bold">
                  ${selectedPlan.planPrice.toFixed(2)}
                </div>
              </div>
            </div>
            
            <PaymentSection
              paymentMethods={paymentMethods}
              selectedPaymentMethod={selectedPaymentMethod}
              onSelectPayment={handlePaymentSelection}
            />
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg mr-4 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={updatePlan.isLoading || !selectedPaymentMethod}
                className="px-6 py-2 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updatePlan.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FaCreditCard size={16} />
                )}
                <span>Update Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
import React, { useState } from "react";
import { CgCreditCard } from "react-icons/cg";
import { MdAddCircleOutline } from "react-icons/md";
import ErrorBoundary from "../../../Components/ErrorBoundary/ErrorBoundary";
import FormAccount from "../Components/Form.Account";
import useGetAllPayments from "../../../utils/react-query-hooks/Payment/useGetAllPayments";
export default function PaymentAccountPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  /* const paymentMethods = [
    {
      _id:1,
      name:"credit card",
      number: "2342-5367-5346-5412"
    },
    {
      _id:2,
      name:"credit card",
      number: "2342-5367-5346-5312"
    },
    {
      _id:3,
      name:"credit card",
      number: "2342-5367-5346-5312"
    },
    {
      _id:4,
      name:"credit card",
      number: "2342-5367-5346-5312"
    },
  ] */
  const splitCreditNumber = (number) => {
    const numbers = number?.split("-");
    return [numbers[0], numbers[1], "****", "****"];
  };
  const { data, isLoading, isError, error, refetch } = useGetAllPayments();
  const handleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  React.useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup effect
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <FormAccount isExpanded={isExpanded} handleExpanded={handleExpanded} refetchCredits={refetch} />
      
      {/* Payment Methods Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Methods</h2>
        <p className="text-sm text-gray-600 mb-6">Choose payment method from the list below</p>
        
        <ErrorBoundary isLoading={isLoading} isError={isError} error={error}>
          <div className="space-y-4 mb-6">
            {data?.data?.length > 0 ? (
              data.data.map((credit, i) => (
                <div 
                  className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-primaryA0 transition-colors" 
                  key={credit._id}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primaryA0/10 p-2 rounded-full">
                      <CgCreditCard className="text-primaryA0 text-xl" />
                    </div>
                    <div>
                      <div className="font-medium">{credit.fullName}</div>
                      <div className="text-sm text-gray-500">{credit.cardNumber}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-gray-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-1">No payment methods found</p>
                <p className="text-sm text-gray-500">Add a payment method to manage your subscriptions</p>
              </div>
            )}
          </div>
        </ErrorBoundary>
        
        <button 
          onClick={handleExpanded}
          className="flex items-center gap-2 bg-primaryA0 hover:bg-primaryA0/90 text-white px-4 py-2 rounded-md transition-colors"
        >
          <MdAddCircleOutline size={20} />
          <span>Add New Payment Method</span>
        </button>
      </div>
    </div>
  );
}

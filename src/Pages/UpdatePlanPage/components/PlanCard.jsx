import React from 'react';
import { FaCheck } from 'react-icons/fa';

export default function PlanCard({ plan, isCurrentPlan, onSelect, disabled }) {
  const handleSelect = () => {
    if (!disabled) {
      onSelect(plan);
    }
  };
  
  // Styling based on plan type
  const getCardStyle = () => {
    switch (plan.planType) {
      case 'featured':
        return {
          border: 'border-purple-500',
          header: 'bg-purple-500 text-white',
          button: 'bg-purple-500 hover:bg-purple-600 text-white',
        };
      case 'premium':
        return {
          border: 'border-blue-500',
          header: 'bg-blue-500 text-white',
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
        };
      default: // basic
        return {
          border: 'border-primaryA0',
          header: 'bg-primaryA0 text-white',
          button: 'bg-primaryA0 hover:bg-primaryA0/90 text-white',
        };
    }
  };
  
  const styles = getCardStyle();
  
  return (
    <div 
      className={`border-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all ${styles.border} ${isCurrentPlan ? 'ring-2 ring-offset-2 ring-primaryA0' : ''}`}
    >
      <div className={`p-4 ${styles.header}`}>
        <h3 className="text-xl font-bold capitalize">{plan.planType}</h3>
        <div className="mt-2 text-sm opacity-90">
          {isCurrentPlan && <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">Current Plan</span>}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <span className="text-2xl font-bold">${plan.planPrice.toFixed(2)}</span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>
        
        <div className="mb-6">
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <FaCheck className="text-green-500 flex-shrink-0 mt-1 mr-2" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={handleSelect}
          disabled={disabled || isCurrentPlan}
          className={`w-full py-2 rounded-lg transition-colors ${styles.button} ${
            isCurrentPlan ? 'opacity-60 cursor-not-allowed' : ''
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
} 
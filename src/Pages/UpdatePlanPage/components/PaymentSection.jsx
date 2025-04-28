import React from 'react';
import { FaCreditCard, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PaymentSection({ paymentMethods, selectedPaymentMethod, onSelectPayment }) {
  const navigate = useNavigate();
  
  const handleAddPaymentMethod = () => {
    navigate('/account/billing');
  };
  
  const formatCardNumber = (cardNumber) => {
    return `•••• ${cardNumber.slice(-4)}`;
  };
  
  return (
    <div>
      <h4 className="font-medium mb-3">Payment Method</h4>
      
      {paymentMethods.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4">
          <p>You don't have any payment methods saved. Add a payment method to continue.</p>
          <button
            onClick={handleAddPaymentMethod}
            className="mt-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <FaPlus size={14} />
            <span>Add Payment Method</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method._id}
              className={`border p-3 rounded-lg cursor-pointer transition-colors flex items-center ${
                selectedPaymentMethod === method._id
                  ? 'border-primaryA0 bg-primaryA0/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectPayment(method._id)}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <FaCreditCard className={`mr-2 ${selectedPaymentMethod === method._id ? 'text-primaryA0' : 'text-gray-600'}`} />
                  <span className="font-medium">{method.cardBrand || 'Card'}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatCardNumber(method.cardLast4 || '****')}
                  <span className="mx-2">•</span>
                  Expires {method.expMonth || 'MM'}/{method.expYear || 'YY'}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full ${
                  selectedPaymentMethod === method._id
                    ? 'bg-primaryA0 border-2 border-white'
                    : 'border border-gray-300'
                }`}>
                  {selectedPaymentMethod === method._id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleAddPaymentMethod}
            className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus size={14} />
            <span>Add Payment Method</span>
          </button>
        </div>
      )}
    </div>
  );
} 
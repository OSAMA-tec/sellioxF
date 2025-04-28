import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function PaymentFormWrapper(props) {
  const [clientSecret, setClientSecret] = useState(null);
  const { user } = useSelector(state => state.user);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };


  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.post("/credit/setup", {
        fullName: user.fullName,
        email: user.email,
      });
      setClientSecret(data?.clientSecret);
    } catch (err) {
      console.error("Failed to get clientSecret", err);
    }

  }
  useEffect(() => {
    // Fetch the SetupIntent (or PaymentIntent) from your server
    fetchData()
  }, []);

  if (!clientSecret) {
    // Return a loading spinner or nothing until the clientSecret is loaded
    console.log('......................')
    return <p>Loading payment...</p>;
  }

  return (
    <>
      {clientSecret !== null && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm clientSecret={clientSecret}  {...props} />
        </Elements>
      )}
    </>
  );
}

export default PaymentFormWrapper;
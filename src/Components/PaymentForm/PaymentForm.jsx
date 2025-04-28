import React, { useState, useEffect } from 'react'
import { CardElement, PaymentElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import useGetAllPayments from '../../utils/react-query-hooks/Payment/useGetAllPayments';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function PaymentForm({ handleExpanded, clientSecret }) {

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const { refetch } = useGetAllPayments();
  const { user } = useSelector(state => state.user);
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!elements) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, elements]);

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }

    if (!clientSecret) {
      console.error("Error: clientSecret is missing or invalid!");
      setErrorMessage("ClientSecret is missing.");
      return;
    }
    try {
      await elements.submit();

      const { setupIntent, error: confirmError } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: 'if_required',
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (confirmError) {
        console.log(confirmError);
        setErrorMessage(confirmError.message);
        return;
      }
      console.log(setupIntent);
      // (Optionally) save the payment method to your backend
      await axiosInstance.post("/credit/save", {
        paymentId: setupIntent.payment_method,
        fullName: user.fullName,
        email: user.email,
      }).then((data) => {
        console.log(data);
        setSuccessMessage("Credit Added Successfully");
        setErrorMessage("");
        refetch();
        if (handleExpanded) {
          setTimeout(handleExpanded, 3000)
        }

      });

    } catch (error) {
      console.log(error);

      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    if (elements) {
      setIsLoaded(true);
    }
  }, [elements]);

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-col gap-4 mt-4'>
        <div className='border py-3 px-2 rounded-md'>
          <PaymentElement onReady={() => setIsLoaded(true)} options={{
            layout: "tabs",
          }} />
        </div>
        <div className='mt-4 flex justify-end'>
          <button className='btn-black' type='submit' disabled={!isLoaded || !stripe} >add payment method</button>
        </div>
        {successMessage && <p className='text-green-700'>{successMessage}</p>}
        {errorMessage && <p className='text-red-700'>{errorMessage}</p>}
      </div>
    </form>
  )
}


export default PaymentForm
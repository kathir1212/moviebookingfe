// components/StripeWrapper.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QzJS5Rh9SoZG377smWVCUj5LjEAyj5yz9Y517ADYos31ws0zNq4oZmWw1cFXxi3yCQLxs9bWmIMK7ShMH5e8Eqt00ynNDOGfy');

const StripeWrapper = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;

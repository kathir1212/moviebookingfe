// components/PaymentForm.js
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';

const PaymentForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', { amount });
    const clientSecret = data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setPaymentStatus(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment Successful!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 mx-auto bg-white rounded shadow-md">
      <CardElement />
      <button type="submit" disabled={!stripe} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Pay ₹{amount}
      </button>
      {paymentStatus && <p className="mt-2 text-green-600">{paymentStatus}</p>}
    </form>
  );
};

export default PaymentForm;

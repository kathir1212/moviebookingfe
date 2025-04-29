import React, { useState } from 'react';
import axios from 'axios';

function PaymentPage({ bookingId, userId, amount }) {
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // Set default payment method
  const [transactionId, setTransactionId] = useState('');
  const [status, setStatus] = useState('');

  const handlePayment = async () => {
    try {
      // Here you would get the transaction ID after the payment process with Stripe
      // For example, Stripe would give you a transaction ID upon successful payment

      const res = await axios.post('https://moviebookingserver-ojrj.onrender.com/payment', {
        bookingId,
        userId,
        amount,
        paymentMethod,
        transactionId, // Use the actual transaction ID received after payment
      });

      setStatus('Payment successful!');
    } catch (error) {
      console.error('Error during payment:', error);
      setStatus('Payment failed');
    }
  };

  return (
    <div>
      <h2>Complete Payment</h2>
      <p>Amount: ₹{amount}</p>
      <button onClick={handlePayment}>Pay Now</button>
      <p>Status: {status}</p>
    </div>
  );
}

export default PaymentPage;

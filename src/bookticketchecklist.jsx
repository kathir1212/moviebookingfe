
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSeat } from './context/SeatContext';
import axios from 'axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';


function Bookticketchecklist() {
   const {
      movieId, theater, date, time,
      selectedSeats,
      selectedShow,
      fetchShowtimeData,
    } = useSeat();
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const [showtime, setShowtimeinfo] = useState(null);
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/seat/${id}`);
        setShowtimeinfo(res.data);
      } catch (error) {
        console.error('Error fetching showtime data:', error);
      }
    };
    fetchShowtimeData();
  }, [id]);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      const ticketPrice = 100;
      setAmount(selectedSeats.length * ticketPrice);
    }
  }, [selectedSeats]);

  const handleBooking = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('auth'))?.userid;
      console.log(userId,"useruseruser");
      
      if (!userId) {
        setStatus('User not logged in.');
        return;
      }

      await axios.post("https://moviebookingserver-ojrj.onrender.com/booking/ticket", {
        showtime: showtime?._id,
        user: userId,
        seatsBooked: selectedSeats.length,
        seatNumbers: selectedSeats
      });
      setStatus("Booking Successful!");
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("Booking failed!");
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    try {
      const res = await axios.post('https://moviebookingserver-ojrj.onrender.com/api/create-payment-intent', { amount });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setStatus(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        setStatus('Payment successful!');
        handleBooking(); // Only book if payment successful
      }
    } catch (err) {
      console.error("Payment error:", err);
      setStatus("Payment failed!");
    }
  };

  return (
    <div className="mt-16 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Selected Seats</h2>
      {selectedSeats.length > 0 ? (
        <div className="mb-4">
          {selectedSeats.map((seat, i) => (
            <div key={i} className="text-lg mb-2">Seat: {seat}</div>
          ))}
          <h3 className="text-xl mt-4">Total : {selectedSeats.length * selectedShow.ticketPrice} ₹</h3>
        </div>
      ) : (
        <h3>No seats selected</h3>
      )}

      <h3 className="text-2xl font-semibold mt-6 mb-4">Payment Info</h3>
      <form onSubmit={handlePayment} className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
              },
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!stripe}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Pay ₹{amount}
        </button>
      </form>
      {status && <p className="mt-4 text-center text-lg">{status}</p>}
    </div>
  );
}

export default Bookticketchecklist;


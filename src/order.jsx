import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Order() {
  const [booking, setBookinginfo] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token"); // Get Bearer token
      const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/booking/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to request header
        },
      });
  
      const allBookings = res.data.data;
      const email = JSON.parse(localStorage.getItem("auth"))?.email;
      setUserEmail(email);
  
      const filteredBookings = allBookings.filter(
        (booking) => booking?.user?.email === email
      );
  
      setBookinginfo(filteredBookings);
    } catch (error) {
      console.error("Failed to fetch booking data", error);
    }
  };
  

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmDelete = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`https://moviebookingserver-ojrj.onrender.com/booking/ticket/${bookingToDelete}`);
      alert("Booking deleted successfully");
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Failed to delete booking", error);
      alert("Error deleting booking");
    }
  };

  return (
    <div className="p-2 sm:ml-64 mt-[5%]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Movie</th>
              <th className="px-6 py-3">Theater</th>
              <th className="px-6 py-3">Time/Date</th>
              <th className="px-6 py-3">Seats</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {booking.map((movieinfo, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {movieinfo?.user?.name}
                </td>
                <td className="px-6 py-4">{movieinfo?.user?.email}</td>
                <td className="px-6 py-4">{movieinfo?.showtime?.movie?.Title}</td>
                <td className="px-6 py-4">{movieinfo?.showtime?.threater?.threater_name}</td>
                <td className="px-6 py-4">
                  {movieinfo?.showtime?.time}|{new Date(movieinfo?.showtime?.date).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4">
                  {movieinfo?.seatNumbers?.join(", ")}
                </td>
                <td className="px-6 py-4">
                  
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => confirmDelete(movieinfo._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {booking.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center px-6 py-4 text-gray-600 dark:text-gray-400">
                  No bookings found for "{userEmail}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50  ">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Are you sure you want to cancl this booking?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;

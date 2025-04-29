import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSeat } from '../context/SeatContext';
import axios from 'axios';

const seats = Array.from({ length: 8 * 8 }, (_, i) => i); // 8x8 seats

export default function Cinema() {
  const { selectedSeats, handleSelectedState, movieId, theater, date, time } = useSeat();
  const [seatsOccupied, setSeatsOccupied] = useState([]);

  const fetchShowtimeData = async () => {
    try {
      const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/seat/find`, {
        params: { movieId, theater, date, time },
      });
      console.log(res, 'API response ✅');
      setSeatsOccupied(res.data.seatsoccupied);
    } catch (error) {
      console.error('Error fetching showtime data:', error);
    }
  };

  useEffect(() => {
    fetchShowtimeData();
  }, [movieId, theater, date, time]);

  return (
    <div className="Cinema">
      <div className="screen bg-gray-700 w-full h-8 rounded-md text-center text-sm mb-6 text-white">Screen</div>
      <div className="seats grid grid-cols-8 gap-2 justify-center">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = seatsOccupied.includes(seat);

          return (
            <span
              key={seat}
              tabIndex="0"
              className={clsx('seat', isSelected && 'selected', isOccupied && 'occupied')}

              onClick={() => !isOccupied && handleSelectedState(seat)}
            >
             
            </span>
          );
        })}
      </div>

      <p className="text-white mt-6 text-center">
        ✅ Selected Seats: <span className="text-green-400">{selectedSeats.join(', ') || 'None'}</span>
      </p>
    </div>
  );
}

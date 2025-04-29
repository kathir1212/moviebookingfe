import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const movieId = query.get('movieId');
  const theater = query.get('theater');
  const date = query.get('date');
  const time = query.get('time');

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const fetchShowtimeData = async () => {
    try {
      const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/seat/find`, {
        params: { movieId, theater, date, time },
      });
      console.log(res.data,"ressssss");
      
      setSelectedShow(res.data);

    } catch (error) {
      console.error('Error fetching showtime data:', error);
    }
  };

  const handleSelectedState = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <SeatContext.Provider
      value={{
        movieId,
        theater,
        date,
        time,
        selectedSeats,
        selectedShow,
        fetchShowtimeData,
        handleSelectedState,
      }}
    >
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => useContext(SeatContext);

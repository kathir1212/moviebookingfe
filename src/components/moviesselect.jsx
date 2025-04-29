import React from 'react';
import { useSeat } from '../context/SeatContext';

export default function Movies() {
  const { movies, selectedMovie, setSelectedMovie, setSelectedSeats } = useSeat();

  return (
    <div className="Movies">
      <label htmlFor="movie">Pick a movie</label>
      <select
        id="movie"
        value={selectedMovie.name}
        onChange={(e) => {
          setSelectedSeats([]); // Reset selected seats when changing movie
          setSelectedMovie(movies.find((m) => m.name === e.target.value));
        }}
      >
        {movies.map((m) => (
          <option key={m.name} value={m.name}>
            {m.name} (${m.price})
          </option>
        ))}
      </select>
    </div>
  );
}

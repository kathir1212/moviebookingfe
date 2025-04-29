import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddShow() {
  const [movieId, setMovieId] = useState('');
  const [theaterId, setTheaterId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    axios.get('https://moviebookingserver-ojrj.onrender.com/movieuser/movies/indian/').then((res) => {
      console.log(res.data.data,"res.data.data");
      
      setMovies(res.data.data,"movielist");
    });
    axios.get('https://moviebookingserver-ojrj.onrender.com/threater/threaterlist').then((res) => {
      console.log(res.data,"threater");
      
      setTheaters(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://moviebookingserver-ojrj.onrender.com/seat/show/', {
        movie: movieId,
        threater: theaterId,
        date,
        time,
        seatsoccupied: [1,3], // initialize as empty array
        ticketPrice: Number(ticketPrice), // make sure it's a number
      });
      alert('Show added successfully!');
      setMovieId('');
      setTheaterId('');
      setDate('');
      setTime('');
      setTicketPrice('');
    } catch (error) {
      console.error('Error adding show:', error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add Show</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          required
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.Title}
            </option>
          ))}
        </select>

        <select
          className="w-full border border-gray-300 rounded p-2"
          value={theaterId}
          onChange={(e) => setTheaterId(e.target.value)}
          required
        >
          <option value="">Select Theater</option>
          {theaters.map((t) => (
            <option key={t._id} value={t._id}>
              {t.threater_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full border border-gray-300 rounded p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Time (e.g., 5:00AM)"
          className="w-full border border-gray-300 rounded p-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Ticket Price"
          className="w-full border border-gray-300 rounded p-2"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add Show
        </button>
      </form>
    </div>
  );
}

export default AddShow;

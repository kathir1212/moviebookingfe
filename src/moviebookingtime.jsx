import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Moviebookingtime() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [groupedShows, setGroupedShows] = useState({});
  const [activeDate, setActiveDate] = useState('');

  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/seat/grouped-showtimes/${id}`);
        const movieData = res.data[0];
        setMovie(movieData);

        const grouped = {};
        movieData.shows.forEach(show => {
          const date = new Date(show.date).toLocaleDateString('en-CA');
          if (!grouped[date]) grouped[date] = {};
          if (!grouped[date][show.theater]) grouped[date][show.theater] = [];
          show.time.forEach(time => grouped[date][show.theater].push(time));
        });

        setGroupedShows(grouped);
        const allDates = Object.keys(grouped);
        setActiveDate(allDates[0]); // Default to first date
      } catch (error) {
        console.error('Error fetching showtime data:', error);
      }
    };
    fetchShowtimeData();
  }, [id]);

  if (!movie) return <div className='p-10 text-center'>Loading...</div>;

  return (
    <div className='mt-[3%]'>
      {/* Movie Info */}
      <div className='flex p-[4%] flex-wrap gap-8'>
        <div className='flex-1 min-w-[250px]'>
          <h2 className="text-3xl font-bold font-[Volkhov] mt-4">{movie.Title}</h2>
          <p className="text-gray-700 text-lg font-[Poppins] mt-4">IMDB Rating: 7.5</p>
          <div className='mt-4'>
            <button className='bg-blue-500 p-4 rounded-lg text-white font-[Poppins]'>
              <b>Watch Trailer</b>
            </button>
          </div>
        </div>
        <div className='flex-1 min-w-[150px]'>
          <img className='w-[11rem] rounded-lg' src={movie.Poster} alt={movie.Title} />
        </div>
      </div>

      {/* Date Navbar */}
      <div className='overflow-x-auto border-b border-gray-300 px-[4%]'>
        <div className='flex gap-4 py-3'>
          {Object.keys(groupedShows).map((date, i) => (
            <button
              key={i}
              onClick={() => setActiveDate(date)}
              className={`px-4 py-2 rounded-full font-[Poppins] whitespace-nowrap ${
                activeDate === date
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
              } transition-all`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Showtimes for Selected Date Only */}
      <div className='p-[4%]'>
        <h2 className='text-xl font-bold font-[Poppins] mb-3'>{activeDate}</h2>
        {groupedShows[activeDate] ? (
          Object.entries(groupedShows[activeDate]).map(([theater, times], i) => (
            <div key={i} className='mb-6'>
              <h3 className='text-lg font-semibold font-[Poppins]'>{theater}</h3>
              <div className='flex gap-2 text-sm text-gray-500 mt-1'>
                <span>4K</span>
                <span>RGB Laser</span>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3 font-[Poppins] text-green-600'>
                {times.map((time, j) => (
                  <Link
                    key={j}
                    to={`/seat/find?movieId=${id}&theater=${encodeURIComponent(theater)}&date=${activeDate}&time=${time}`}
                  >
                    <div className='p-3 border border-[#cdcdcd] rounded-lg text-center hover:bg-green-100 hover:text-black transition-all duration-150'>
                      <span>{time}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No showtimes available for this date.</p>
        )}
      </div>
    </div>
  );
}

export default Moviebookingtime;

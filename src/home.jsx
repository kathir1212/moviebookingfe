import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useFormik } from "formik";
import { Link } from 'react-router-dom';

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); 
  const [showtimes, setShowtimeinfo] = useState([]);  
  const [searchQuery, setSearchQuery] = useState("avengers"); 
  const API_KEY = "1ea9b292"; // Keep this in an environment variable

  // Get the token from localStorage or another secure location
  const token = localStorage.getItem("token");

  const fetchMovies = async (query, newPage = 1, reset = false) => {
    try {
      const response = await axios.get(`https://moviebookingserver-ojrj.onrender.com/movieuser/movies/${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to the headers
        }
      });
      
      if (response.data.data) {
        setMovies(prevMovies => reset ? response.data.data : [...prevMovies, ...response.data.data]); 
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const Showtimeapi = async () => {
    try {
      const response = await axios.get(`https://moviebookingserver-ojrj.onrender.com/seat/grouped-showtimes`, {
        headers: {
          Authorization: `Bearer ${token}` // Add Bearer token to the headers
        }
      });

      const showlists = response.data;
      setShowtimeinfo(showlists); 
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };

  useEffect(() => {
    fetchMovies(searchQuery, 1, true); 
    Showtimeapi();
  }, []);

  const formik = useFormik({
    initialValues: { username: "" },
    validate: (values) => {
      let error = {};
      if (!values.username.trim()) {
        error.username = "Please enter a movie name";
      }
      return error;
    },
    onSubmit: (values) => {
      setSearchQuery(values.username);
      setPage(1);
      fetchMovies(values.username, 1, true); 
    },
  });

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(searchQuery, nextPage);
  };

  return (
    <div className="pt-[4rem] bg-gray-100">
      <div>
        <form className="max-w-md mx-auto mt-[3%]" onSubmit={formik.handleSubmit}>   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              id="default-search" 
              name="username" 
              value={formik.values.username} 
              onChange={formik.handleChange}
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Search Movies List" 
              required 
            />
            <button 
              type="submit" 
              className="font-[Poppins] text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-[Poppins]"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center items-center">
        <div className="grid gap-6 p-16 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {showtimes.map((movieinfo, index) => (
            <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <Link to={`/movie/${movieinfo._id}`}>
                <img src={movieinfo.Poster} alt={movieinfo.Title} className="rounded-t-lg w-full h-48 object-cover" />
              </Link>
              <div className="p-5">
                <Link to={`/movie/${movieinfo._id}`}>
                  <h5 className="text-md font-[Poppins] text-center"><b>{movieinfo.Title}</b></h5>
                </Link>
                <div className="text-center">
                  <Link to={`/movie/${movieinfo._id}`}>
                    <button 
                      type="button" 
                      className="text-blue-500 text-4xl hover:bg-blue-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {movies.length > 0 && (
        <div className="text-center mt-5 mb-[3%]">
          <button onClick={loadMore} className="px-5 py-2 bg-green-600 text-white rounded-lg">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;

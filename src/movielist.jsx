import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("indian");

  const fetchMovies = async (query, newPage = 1, reset = false) => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.get(`https://moviebookingserver-ojrj.onrender.com/movieuser/movies/${query}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Set Bearer token
        },
      });
      console.log(response.data.data, "response.data.data");
  
      if (response.data.data) {
        setMovies((prevMovies) => (reset ? response.data.data : [...prevMovies, ...response.data.data]));
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  

  useEffect(() => {
    fetchMovies(searchQuery, 1, true);
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
    <div className="pt-20 bg-gray-100 min-h-screen">
      {/* Search Form */}
      <form className="max-w-lg mx-auto mt-8" onSubmit={formik.handleSubmit}>
        <div className="relative">
          <input
            type="search"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            className="w-full p-3 pl-10 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Movies..."
          />
          <button type="submit" className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </div>
      </form>

      {/* Movies Grid */}
      <div className="container mx-auto px-6 mt-8">
        <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {movies.map((movie, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition hover:scale-105">
              <Link to={`movie/${movie.id}`}>
                <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
              </Link>
              <div className="p-4 text-center">
                <Link to={`movie/${movie.id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {movie.Title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {movies.length > 0 && (
        <div className="text-center mt-8 mb-6">
          <button onClick={loadMore} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieList;

import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate , Navigate } from 'react-router-dom';

import Home from './home';
import Moviebookingtime from './moviebookingtime';
import Seat from './seat';
import Dashboard from './dashboard';
import Bookticketchecklist from './bookticketchecklist';
import { SeatProvider } from './context/SeatContext';
import MovieList from './movielist';
import Threaterlist from './threaterlist';
import Order from './order';

import Profile from './assets/download.png';
import logo from './assets/images.png';

import Login from './components/login';
import Register from './components/register';
import ResetPassword from './components/resetpassword';
import ForgotPassword from './components/forget';
import AddShow from './components/addshow';
import AddTheater from './components/addthreater';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AllOrder from './components/allOrderlist';
import Showtimelist from './components/showtimelist';

// Initialize Stripe public key
const stripePromise = loadStripe('pk_test_51QzJS5Rh9SoZG377smWVCUj5LjEAyj5yz9Y517ADYos31ws0zNq4oZmWw1cFXxi3yCQLxs9bWmIMK7ShMH5e8Eqt00ynNDOGfy');

function App() {
  const [auth, setAuth] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // To navigate after logout
  const isAdmin = auth?.role === 'admin';

  // Routes where the navbar should be hidden
  const hideNavbarRoutes = ['/', '/login', '/register', '/forgot-password'];
  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/reset-password');

    const PrivateRoute = ({ children }) => {
      const token = localStorage.getItem('token');
      return token ? children : <Navigate to="/login" replace />;
    };

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    setAuth(storedAuth);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth'); // Clear auth data
    localStorage.removeItem('token'); // Clear the token (if you store it separately)
    setAuth(null); // Update the state to reflect the logged-out status
    navigate('/login'); // Redirect to the login page
  };

  return (
    <>
      {/* ✅ Navbar - Hidden on Auth Pages */}
      {!shouldHideNavbar && (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src={logo} className="h-[3rem]" alt="Logo" />
            </a>

            <div className="flex md:order-2 space-x-4 md:space-x-0 rtl:space-x-reverse">
              <img id="avatarButton" className="w-10 h-10 rounded-full cursor-pointer" src={Profile} alt="User" />
              {/* Logout Button */}
              <button
                onClick={logout}
                className="text-white bg-red-500 px-4 py-2 rounded-lg ml-[10%]"
              >
                Logout
              </button>
            </div>

            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
              <ul className="font-[Poppins] flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li><Link to="/home" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500">Home</Link></li>
                <li><Link to="/movieslist" className="nav-link">Movies</Link></li>
                <li><Link to="/threaterlist" className="nav-link">Threater</Link></li>
                <li><Link to="/order" className="nav-link">Order</Link></li>
                {isAdmin && (
                  <li><Link to="/dashboard/allorder" className="nav-link">Dashboard</Link></li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* ✅ Routes */}
      <div className="">
        <SeatProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/movieslist" element={<PrivateRoute><MovieList /></PrivateRoute>} />
            <Route path="/threaterlist" element={<PrivateRoute><Threaterlist /></PrivateRoute>} />
            <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
            <Route path="/movie/:id" element={<PrivateRoute><Moviebookingtime /></PrivateRoute>} />
            <Route path="/seat" element={<PrivateRoute><Seat /></PrivateRoute>} />
            <Route path="/seat/:id" element={<PrivateRoute><Seat /></PrivateRoute>} />

            {/* ✅ Admin-only Dashboard with nested routes */}
            {isAdmin && (
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                <Route path="add-theater" element={<AddTheater />} />
                <Route path="add-show" element={<AddShow />} />
                <Route path="allorder" element={<AllOrder />} />
                <Route path="showtimelist" element={<Showtimelist/>} />
              </Route>
            )}

            {/* ✅ Stripe Payment Route for Booking */}
            <Route
              path="/seat/checklist/:id"
              element={
                <Elements stripe={stripePromise}>
                  <Bookticketchecklist />
                </Elements>
              }
            />
          </Routes>
        </SeatProvider>
      </div>
    </>
  );
}

export default App;

import React from 'react'
import { useState , useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Dashboard() {

const [booking, setBookinginfo] = useState([]);  

  let Showtimeapi = async () => {
    

   await axios.get(`https://moviebookingserver-ojrj.onrender.com/booking/`)  
    .then(res => {  
      const showlists = res.data.data;  
    console.log(showlists,"aninini");
    
    setBookinginfo(showlists); 
     
       
    })    

    
     

  }


useEffect(() => {
    Showtimeapi();

  }, []);


  return (
   <>
  <div className="flex mt-[5rem]">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-800 text-white p-4 space-y-4">
        <Link to="/dashboard/add-theater" className="block hover:text-yellow-300">Add Theater</Link>
        <Link to="/dashboard/add-show" className="block hover:text-yellow-300">Add Show</Link>
        <Link to="/dashboard/allorder" className="block hover:text-yellow-300">AllOrder</Link>
        {/* <Link to="/dashboard/threaterlist" className="block hover:text-yellow-300">TheaterList</Link> */}
        <Link to="/dashboard/showtimelist" className="block hover:text-yellow-300">ThreaterList</Link>

        {/* Add more links as needed */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  
   </>
  )
}

export default Dashboard



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Showtimelist() {

  const { id } = useParams(); 
  
  const [product, setProductsinfo] = useState({});
  const [threaters, setThreaterinfo] = useState([]);
  const [showtime, setShowtimeinfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("avengers");
    const [movies, setMovies] = useState([]);
  




  // let productdetailapi = async (id) => {
  //   console.log(id,"ididididi");
    

  //   axios.get(`${id}`)  
  //   .then(res => {  
  //     const animals = res.data;  
  //   console.log(animals,"aninini");
    
  //     setProductsinfo(animals); 
     
       
  //   })    
     

  // }


  let threaterlistapi = async () => {
    const token = localStorage.getItem("token"); // or wherever you store the JWT token
    console.log(id, "ididididi");
  
    try {
      const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/threater/threaterlist`);
  
      const threaterlists = res.data;
      console.log(threaterlists, "aninini");
      setThreaterinfo(threaterlists);
      console.log(threaters, ">>>>>");
    } catch (error) {
      console.error("Error fetching threater list:", error);
    }
  };
  

  const fetchMoviesid = async (query, newPage = 1, reset = false , id) => {
    try {
      const response = await axios.get(`https://moviebookingserver-ojrj.onrender.com/movieuser/movies/${searchQuery}/${id}`);
      console.log(response.data.data,".....");
      
      if (response.data.data) {
        setMovies(prevMovies => reset ? response.data.data : [...prevMovies, ...response.data.data]); 
      
      console.log(movies,"????");
      
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  

  let Showtimeapi = async (id) => {
    console.log(id,"ididididi");
    

   await axios.get(`https://moviebookingserver-ojrj.onrender.com/seat`)  
    .then(res => {  
      const showlists = res.data;  
    console.log(showlists,"aninini");
    
    setShowtimeinfo(showlists); 
     
       
    })    

    
     

  }
  
  const deleteTheater = async (id) => {
    const token = localStorage.getItem("token");
  
    if (window.confirm("Are you sure you want to delete this theater?")) {
      try {
        await axios.delete(`https://moviebookingserver-ojrj.onrender.com/threater/threaterlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // After successful delete, remove it from the local state
        setThreaterinfo(threaters.filter(theater => theater._id !== id));
      } catch (error) {
        console.error("Error deleting theater:", error);
        alert("Error deleting theater");
      }
    }
  };
  




  useEffect(() => {
    // productdetailapi(id);
    threaterlistapi();
    Showtimeapi();
    fetchMoviesid(searchQuery, 1, true , id); 

  }, [id]);

  

  return (
//     <div className='mt-[3%] ' >
 

// <div className=' p-[4%]  '>


// {
//         threaters.map((threaterinfo,index) => {
         
//          console.log(threaterinfo,"threeee");
         
          
//           return (
//               <>
//               <div className='flex mb-3 '>

//               <div className='flex-2 p-[2%] '>
// <h1 className='text-2xl font-[poppins]'  key={index}><b>{threaterinfo.threater_name}</b></h1>
// <div className='flex gap-2 font-[poppins] text-gray-500 mt-1'>
// <span>4K</span>
// <span>RGB Laser</span>
// </div>

// </div>


//               </div>
                 
//               <hr className='border-[#cdcdcd]'/>


//               </>
//           )
//       })
//       }

// </div>








// </div>
<div class="">
   

   <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
       <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
           <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
               <tr>
                   <th scope="col" class="px-6 py-3">
                      Theatername
                   </th>
                   <th scope="col" class="px-6 py-3">
                     Action
                   </th>
               </tr>
           </thead>
           <tbody>
   
          {threaters.map((movieinfo, index) => (
       <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
           <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
               {movieinfo?.threater_name}
           </th>
           <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <button className='text-red-500' onClick={() => deleteTheater(movieinfo._id)}>Delete</button>
           </th>
          
          
       </tr>
   ))}
   
   
              
           </tbody>
       </table>
   </div>
   
   </div>
   
   

  );
}

export default Showtimelist;





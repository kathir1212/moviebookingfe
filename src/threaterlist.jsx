
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Threaterlist() {

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
      const res = await axios.get(`https://moviebookingserver-ojrj.onrender.com/threater/threaterlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
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
  





  useEffect(() => {
    // productdetailapi(id);
    threaterlistapi();
    Showtimeapi();
    fetchMoviesid(searchQuery, 1, true , id); 

  }, [id]);

  

  return (
    <div className='mt-[3%] ' >
 

<div className=' p-[4%]  '>


{
        threaters.map((threaterinfo,index) => {
         
         console.log(threaterinfo,"threeee");
         
          
          return (
              <>
              <div className='flex mb-3 '>

              <div className='flex-2 p-[2%] '>
<h1 className='text-2xl font-[poppins]'  key={index}><b>{threaterinfo.threater_name}</b></h1>
<div className='flex gap-2 font-[poppins] text-gray-500 mt-1'>
<span>4K</span>
<span>RGB Laser</span>
</div>

</div>


              </div>
                 
              <hr className='border-[#cdcdcd]'/>


              </>
          )
      })
      }

</div>








</div>
   
   

  );
}

export default Threaterlist;





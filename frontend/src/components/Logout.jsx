import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Logout() {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    let navigate = useNavigate()
    const handleLogout = async () => {
        try {
          const response = await axios.post(
            'http://localhost:5000/auth/logout',
            {},
            { withCredentials: true }
          );
      
          console.log("Logout Response:", response);
      
          if (response.status === 200) {
            setIsLoggedIn(false);
            alert(response.data.message);
          }
        } catch (error) {
          console.error("Logout failed:", error.response?.data || error.message);
          alert("Logout failed: " + (error.response?.data?.message || error.message));
        }
      };
      
      
      
    return (
        <div >
            <div className='grid justify-center  place-items-center gap-4 mt-24 border-2 rounded-lg border-indigo-600  bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 h-48 w-80 m-auto p-4'>
                <div className='flex justify-center items-center '>
                    <h1 className='font-bold'>Logout</h1>
                </div>
                <div className="flex flex-col justify-center items-center p-4 h-30 mb-4 w-72">

                    
                    <div className='mt-4 z-40 '>
                        <button onClick={handleLogout} className='w-64 border-2 rounded-md p-1  outline outline-offset-2 outline-blue-500 bg-violet-500 hover:bg-violet-600 text-gray-200'>Logout</button>

                    </div>
                    {/* <div  className='mt-6'>
           <a href="/">Forgot Password</a>
           </div> */}
                </div>

            </div>
        </div>
    )
}

export default Logout

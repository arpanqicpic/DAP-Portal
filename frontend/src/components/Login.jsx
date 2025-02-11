import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'




function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  let navigate=useNavigate()
  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in with:", { email, password });
  
      const response = await axios.post(
        'http://localhost:5000/auth/login',
        { email, password },
        { withCredentials: true }  // Ensures cookies are sent and received
      );
  
      console.log("Login Response:", response);
  
      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate('/verification');
        alert("Logged in Successfully")
        
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };
  

  return (
    <div
    
      className="h-screen flex justify-center items-center ">
     <div className="grid justify-center items-center gap-4 rounded-lg bg-white-800 to-pink-200 h-96 w-128 m-auto p-4 shadow-2xl">
        <div className="flex justify-center items-center">
          <img className="h-20" src="QicpicLogo.png" alt="QICPIC logo" />
        </div>
        <div className="flex flex-col justify-center items-center p-4 h-30 mb-4 w-84">
          <div className="w-full mb-2 z-40 border-2 rounded-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email ID"
              className="w-full p-2 border-2 rounded-lg"
            />
          </div>
          <div className="w-full mb-2 z-40 border-2 rounded-lg">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
              className="w-full p-2 border-2 rounded-lg"
            />
          </div>
          <div className="mt-4 z-40">
            <button
              onClick={HandleSubmit}
              className="w-72 border-2 h-12 rounded-md p-1 outline outline-offset-2 bg-[#FF6600] hover:bg-blue-600 text-gray-200"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default Login

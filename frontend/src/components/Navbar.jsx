import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Make sure you are using react-router for navigation


const Navbar = ({ passportPhoto }) => {
  const[emp,setEmp]=useState([]);
  useEffect( () => {
    axios
      .get("http://localhost:5000/verify/profile")
      .then((result) => {
        setEmp(Object.values(result.data));
        
      })
      .catch((err) => {
        console.log("Error fetching profile data:", err);
      });
  }, []);

console.log(emp)
 
  return (
    
    <nav className="bg-gradient-to-r to-orange-300  from-yellow-200 ... shadow-md">
      <div className="flex justify-between">
       
        <div className="relative flex items-center justify-between h-16  ">
          
          <div className=" absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-400 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="ml-10 h-12 w-14  flex justify-center rounded-full  ">
            <img src="https://i.tracxn.com/logo/company/qicpic_in_7abb6782-a3b3-4169-9ddd-9a1be675ba37?format=webp&height=120&width=120" alt="" />
          </div>

          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-between">

            <div className="flex text-black text-2xl font-bold gap-4 ">
            {/* <h1>{passportPhoto}</h1> */}
              <div className="flex space-x-4 ">
                DAP
              </div>
              <div className="flex space-x-4">
              <Link
                  to="/verification"
                  className="text-black px-3 py-2 rounded-md text-sm font-medium hover:text-orange-600"
                >
                  Verification Portal
                </Link>
              </div>
            </div>
            
          </div>
        </div>
        <div className="flex justify-center items-center mr-10">
              
              <div className="flex space-x-4 justify-centeritems-center  ">

                <Link
                  to="/profile"
                  className=" flex justify-center items-center text-white px-3 rounded-md text-sm font-medium "
                >
                <div  className="grid justify-center items-center h-15 w-10  ">
                  <div>
                    <img src={emp?.[3]?.passport_photo || "default-image.png"} className="rounded-full" alt="" />
                  </div>
                  <div>
                    <h2 className="pl-1.5 text-black">{emp?.[0]?.first_name || "No Image Available"}</h2>
                  </div>
                </div>
                </Link>

               
              </div>
              
            </div>

      </div>
    </nav>
  );
};

export default Navbar;

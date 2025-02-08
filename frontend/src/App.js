// import './App.css';
// import MerchantDetails from './components/MerchantDetails';
// import Navbar from './components/Navbar';
// import Profile from './components/Profile';
// import Login from './components/Login';
// import Logout from './components/Logout';
// import Verificationportal from './components/Verificationportal';
// import {Routes,Route} from 'react-router-dom'
// import user from '../src/components/Profile'
// import { useLocation } from 'react-router-dom';


// function App() {
//   const location = useLocation();

//   return (
//     <div>
//       {/* Conditionally render Navbar only if the current path is not '/login' */}
//       {location.pathname !== "/login" && <Navbar passportPhoto={user?.passport_photo} />}
      
//       <Routes>
//         <Route path="/verification" element={<Verificationportal />} />
//         <Route path="/profile" element={<Profile user={user} />} />
//         <Route path="/merchatdetails" element={<MerchantDetails />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/logout" element={<Logout />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;




import './App.css';
import MerchantDetails from './components/MerchantDetails';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Login from './components/Login';
import Logout from './components/Logout';
import Verificationportal from './components/Verificationportal';
// import {Routes,Route} from 'react-router-dom'
import user from '../src/components/Profile'
// import { useLocation } from 'react-router-dom';


import { Routes, Route, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const user = { passport_photo: Cookies.get("user_id") }; // Assuming user_id is stored

  return (
    <div>
      {/* Conditionally render Navbar only if the current path is not '/login' */}
      {location.pathname !== "/login" && <Navbar passportPhoto={user?.passport_photo} />}

      <Routes>
        {/* Protected Routes */}
        <Route path="/verification" element={<ProtectedRoute element={<Verificationportal />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile user={user} />} />} />

        {/* Public Routes */}
        <Route path="/merchatdetails" element={<MerchantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;

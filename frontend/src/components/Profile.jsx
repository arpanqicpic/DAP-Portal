
import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";

const Modal = ({ imageSrc, altText, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 1));
  const handleRotate = () => setRotation((prev) => prev + 90);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      
      <div
        className="overflow-hidden"
        style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, transition: "transform 0.3s ease-in-out" }}
      >
          <button 
        onClick={onClose} 
        className="absolute bg-gray-200 rounded-full p-2 transition-transform z-50" 
        // style={{ top: `${5 * scale}vh`, right: `${5 * scale}vw`, transform: `scale(${scale})` }}
      >
        ✖
      </button>
        <img src={imageSrc} alt={altText} className="max-w-full max-h-80 object-cover rounded-md" />
      
      </div>
      <div className="flex gap-2 mt-4 z-50">
        <button onClick={zoomIn} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
          <ZoomIn size={20} />
        </button>
        <button onClick={zoomOut} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleRotate} className="p-2 border rounded-full bg-gray-100 hover:bg-gray-200">
          <RotateCw size={20} />
        </button>
      </div>
    </div>
  </div>
  );
};

function Profile() {
  const [modalImage, setModalImage] = useState(null);
  const [emp, setEmp] = useState([]);
  
  const navigate=useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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

  // console.log(emp);



  if (emp.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading Profile...</p>
      </div>
    );
  }

  {/* Edit Icon */}
  <button
  onClick={() => fileInputRef.current.click()}
  className="absolute top-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all duration-200"
  style={{ transform: "translate(20%, -20%)" }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.121 4.879l5.857 5.857a2 2 0 010 2.828l-2.828 2.828a2 2 0 01-2.828 0L8.879 6.707a2 2 0 010-2.828l2.828-2.828a2 2 0 012.828 0z"
    />
  </svg>
</button>



  const HandleEdit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const distributor_id = emp[0].distributor_id;
    const profile_photo_id = emp[0].profile_photo_id;

    // Create FormData to send the file and other data
    const formData = new FormData();
    formData.append("distributor_id", distributor_id);
    formData.append("profile_photo_id", profile_photo_id);
    formData.append("profile_photo", selectedFile); // Append the selected image file

    try {
      console.log(formData)
      const response = await axios.put(
        "http://localhost:5000/verify/profile/profile_photo_id",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure this header is set for file uploads
          },
        }
      );

      console.log("Profile photo updated successfully:", response.data);
    } catch (error) {
      alert("Update failed", error);
    }
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };



const handleLogout = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/auth/logout',
      {},
      { withCredentials: true }
    );

    console.log("Logout Response:", response);

    if (response.status === 200) {
      // setIsLoggedIn(false);
      navigate('/login')
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    alert("Logout failed: " + (error.response?.data?.message || error.message));
  }
};



    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white mt-0 rounded-lg shadow-xl w-full max-w-6xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-2xl">
          {/* Profile Header */}
          <div className=" text-center mb-0 ">
            <img
              onClick={HandleEdit}
              className="mx-auto h-28 w-28 rounded-full object-cover border-4 border-gray-300 mb-4 hover:border-blue-500 transition-all duration-300 cursor-pointer"
              src=
              {
                emp[3]?.passport_photo
                  ? emp[3].passport_photo
                  : "https://surl.li/default_image_url"
              }
              alt="Profile"
            />
  
            <h2 className="text-3xl font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300">
              {emp[0]?.name}
            </h2>
            <p className="text-gray-600 hover:text-gray-800 transition-all duration-300">
              {emp[0]?.designation}
            </p>
          </div>
  
          {/* Personal Details */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300">
              Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-6 text-gray-700">
              {[
                { label: 'ID', value: emp[0]?.dis_request_id },
                { label: 'Name', value: emp[0]?.first_name },
                { label: 'Sector ID', value: emp[0]?.sector_id },
                { label: 'Email ID', value: emp[0]?.email },
                { label: 'Mobile Number', value: emp[0]?.phone_number },
                { label: 'Location', value: emp[0]?.location },
                { label: 'Entity Name', value: emp[2]?.entity_name },
                { label: 'Entity Type', value: emp[2]?.entity_type },
                { label: 'PAN Number', value: emp[0]?.pan_number },
                { label: 'Aadhar Number', value: emp[0]?.aadhar_number },
                { label: 'Registration Status', value: emp[2]?.registered_status, isStatus: true },
                { label: 'Date of Joining', value: new Date(emp[0]?.date_of_joining).toLocaleDateString() },
                { label: 'Agreement Renewal', value: new Date(emp[0]?.agreement_renewal).toLocaleDateString() },
              ].map((item, index) => (
                <p key={index}>
                  <span className="font-semibold">{item.label}:</span>{' '}
                  {item.isStatus ? (
                    <span className="text-green-600 font-semibold">{item.value}</span>
                  ) : (
                    item.value
                  )}
                </p>
              ))}
            </div>
          </div>
  
          {/* Agreement Details */}
          {emp.length > 1 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4 mt-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300">
                Agreement Details
              </h3>
              <div className="grid grid-cols-2 gap-6 text-gray-700">
                {[
                  { label: 'Agreement Id', field: 'agreement_id', src: emp[1]?.agreement_id },
                  { label: 'Agreement Copy ID', field: 'agreement_copy_id', src: emp[1]?.agreement_copy_id },
                  { label: 'Invoice ID', field: 'invoice_id', src: emp[1]?.invoice_id },
                  { label: 'Welcome Poster', field: 'welcome_poster_image_id', src: emp[1]?.welcome_poster_image_id },
                ].map((item, index) => (
                  <div key={index} className="flex items-center   gap-2 relative">
                    <div className=" flex justify-center items-center px-3">
                    <p>{item.label}:</p>
                    </div>
                   
                      <div className=" left-20 top-0 bg-white border shadow-lg p-2 rounded-lg z-50">
                       <button
                          onClick={() => setModalImage(item.src)}
                          className="bg-blue-500 text-white px-3 py-1  rounded-lg hover:bg-blue-600 transition"
                        >
                          View
                        </button> 
                      </div>
                   
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Account Details */}
          {emp.length > 2 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4 mt-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300">
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-6 text-gray-700">
                {[
                  { label: 'Account Holder Name', value: emp[2]?.account_holder_name },
                  { label: 'Account Number', value: emp[2]?.account_number },
                  { label: 'Bank Name', value: emp[2]?.bank_name },
                  { label: 'IFSC Code', value: emp[2]?.ifsc_code },
                ].map((item, index) => (
                  <p key={index}>
                    <span className="font-semibold">{item.label}:</span> {item.value}
                  </p>
                ))}
              </div>
            </div>
          )}
  
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Modal */}
      {modalImage && <Modal imageSrc={modalImage} altText="Agreement Document" onClose={() => setModalImage(null)} />}
      </div>
    );
  };
  

export default Profile;



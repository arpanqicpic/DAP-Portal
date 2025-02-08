

import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import Toast from "./Toast";

const MerchantDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [modalImage, setModalImage] = useState(null);
  const [imageStatus, setImageStatus] = useState({
    merchant_shop_indoor_image: null,
    merchant_shop_outdoor_image: null,
    board_image: null,
    visiting_card_image: null,
  });
  const [feedbacks, setFeedbacks] = useState({});
  const [currentImageKey, setCurrentImageKey] = useState("");
  const [toast, setToast] = useState(null);
  const [merchantStatus, setMerchantStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [mapRejectionReason, setMapRejectionReason] = useState(""); // Separate state for map rejection reason
  const [showRejectionDropdown, setShowRejectionDropdown] = useState(false);
  const [showMapRejectionDropdown, setShowMapRejectionDropdown] = useState(false); // For map rejection dropdown

  const [merchantmapStatus, setmerchantMapStatus] = useState("Pending");
  const [mapFeedback, setMapFeedback] = useState("Pending");
  const [showMapModal, setShowMapModal] = useState(false);

  const [showOtherReason, setShowOtherReason] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const inputRef = useRef(null)
  const [lastTime, setLastTime] = useState(null)

  // const currentDate = new Date();
  const row = location.state?.row;

  // Dummy latitude and longitude for the merchant's location
  const TLlatitude = 40.7128;  // Example latitude (New York)
  const TLlongitude = -74.0060; // Example longitude (New York)

  const latitude = 40.7128;  // Example latitude (New York)
  const longitude = -74.0060;

  useEffect(() => {
    if (showOtherReason && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showOtherReason]);

  // Handle Map Accept
  const handleMapAccept = () => {
    setmerchantMapStatus("Accepted");
    setShowMapModal(false);  // Close the map modal
    showToast("Merchant location accepted", "Accepted");
    updateVerificationStatus("Accepted");
    SaveFeedback();
  };


  const [zoom, setZoom] = useState(1); // State for zoom level

  const handleWheel = (e) => {
    e.preventDefault(); // Prevent page scroll while zooming
    if (e.deltaY < 0) {
      setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Zoom in, limit to max zoom of 3
    } else {
      setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Zoom out, limit to min zoom of 1
    }
  };

  // Handle Map Reject
  const handleMapReject = () => {
    setmerchantMapStatus("Rejected");
    setShowMapRejectionDropdown(true);  // Open map rejection dropdown
    showToast("Merchant location rejected. Please provide a reason.", "Rejected");
  };

  // Handle rejection reason change for map
  const handleMapRejectionReasonChange = (e) => {
    setMapFeedback(e.target.value);
    setMapRejectionReason(e.target.value);
  };

  // Save map rejection feedback
  const saveMapRejectionFeedback = () => {
    setFeedbacks((prevFeedbacks) => {
      const updatedFeedbacks = {
        ...prevFeedbacks,
        map_location: mapRejectionReason || "No Feedback",
      };
      return updatedFeedbacks;
    });
    setShowMapRejectionDropdown(false);
    setMapRejectionReason(""); // Clear map rejection reason
    setShowMapModal(false);
  };


  const saveMapAcceptedFeedback = () => {
    // console.log("Accepted Maplocation")
    setFeedbacks((prevFeedbacks) => {

      const updatedFeedbacks = {
        ...prevFeedbacks,
        map_location: mapRejectionReason || "No Feedback",
      };

      return updatedFeedbacks;
    });
    setShowMapRejectionDropdown(false);
    setMapRejectionReason(""); // Clear map rejection reason
    setShowMapModal(false);
  };




  const handleBack = () => navigate(-1);

  const handleClick = (imageKey, image) => {
    setCurrentImageKey(imageKey);
    setModalImage(image);
    setShowRejectionDropdown(false);
  };

  const handleAccept = () => {
    setImageStatus((prevState) => ({
      ...prevState,
      [currentImageKey]: "Accepted",
    }));
    setModalImage(null);
    updateImageStatus(currentImageKey, "Accepted");

    setFeedbacks((prevFeedbacks) => {
      const updatedFeedbacks = { ...prevFeedbacks };
      delete updatedFeedbacks[currentImageKey];
      return updatedFeedbacks;
    });
  };

  const handleReject = () => {
    setImageStatus((prevState) => ({
      ...prevState,
      [currentImageKey]: "Rejected",
    }));
    setShowRejectionDropdown(true);
    updateImageStatus(currentImageKey, "Rejected");
  };




  const updateImageStatus = async (imageKey, status) => {
    try {
      const updatedData = {
        merchant_lead_id: row.merchant_lead_id,
        [`${imageKey}_status`]: status === "Accepted" ? 1 : 0,
      };
      await axios.patch("http://localhost:5000/verify/imagestatus", updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      showToast(`${imageKey.replace(/_/g, " ")} ${status}`, status);
    } catch (error) {
      console.error("Error updating image status:", error);
      showToast("Error updating image status", "error");
    }
  };




  const updateLocationStatus = async (locationStatus, status) => {
    try {
      // Dynamically set the field value based on the status
      const updatedData = {
        merchant_lead_id: row.merchant_lead_id,
        [locationStatus]: status === "Accepted" ? 1 : 0,  // Dynamically set the key and value
      };

      await axios.patch("http://localhost:5000/verify/imagestatus", updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      // Optional: showToast(`${imageKey.replace(/_/g, " ")} ${status}`, status);
    } catch (error) {
      console.error("Error updating image status:", error);
      showToast("Error updating image status", "error");
    }
  };





  const updateVerificationStatus = async (status) => {

    const currentDate = new Date()
    const day = currentDate.getDate();           // Day of the month
    const month = currentDate.getMonth() + 1;    // Month (0-based, so adding 1)
    const year = currentDate.getFullYear();      // Full year (e.g., 2025)
    const hours = currentDate.getHours();        // Hours
    const minutes = currentDate.getMinutes();    // Minutes
    const seconds = currentDate.getSeconds();    // Seconds

    // Format the date and time
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    setLastTime(formattedDate);
    // console.log(lastTime)


    try {
      await axios.patch("http://localhost:5000/verify/verificationstatus", {
        merchant_lead_id: row.merchant_lead_id,
        status: status, status_time_stamp: formattedDate,
      });

      // setMerchantStatus(status);


      showToast(`Merchant ${status}`, status);

    } catch (error) {

      console.error("Error updating merchant status:", error);
      showToast("Error updating merchant status", "error");

    }
  };

  const handleRejectionReasonChange = (event) => {
    const selectedValue = event.target.value;
    setRejectionReason(selectedValue);

    if (selectedValue === "Other") {
      setShowOtherReason(true);
    } else {
      setShowOtherReason(false);
    }
  };
  const saveRejectionFeedback = () => {
    setFeedbacks((prevFeedbacks) => {
      const finalReason = rejectionReason === "Other" ? otherReason : rejectionReason;
      const updatedFeedbacks = {
        ...prevFeedbacks,
        [currentImageKey]: finalReason,
      };
      return updatedFeedbacks;
    });


    setShowRejectionDropdown(false);
    setRejectionReason("");
    setOtherReason("")
    setModalImage(null);
  };



  const SaveFeedback = async () => {

    const updatedFeedbacks = { ...feedbacks, location_feedback: mapFeedback };


    console.log(updatedFeedbacks)

    try {

      console.log(feedbacks)

      await axios.patch("http://localhost:5000/verify/feedback", {
        merchant_lead_id: row.merchant_lead_id,
        feedbacks
      });

      alert("Feedback Saved");

    } catch (error) {
      console.error("Error in Saving Feedbacks", error);
    }
  };



  const showToast = (message, status) => {
    const toastType =
      status === "Accepted"
        ? "success"
        : status === "Rejected"
          ? "error"
          : "warning";
    setToast({ message, type: toastType });
    setTimeout(() => setToast(null), 3000);
  };

  const showImageStatus = async (merchant_lead_id) => {

    try {
      const imagestatusdata = await axios.post(
        "http://localhost:5000/verify/imagestatus",
        { merchant_lead_id },
        { headers: { "Content-Type": "application/json" } }
      );

      const statusData = imagestatusdata.data;



      setmerchantMapStatus(statusData[0].location_status === 1 ? "Accepted" : statusData[0].location_status === 0 ? "Rejected" : "Pending")



      setImageStatus({
        merchant_shop_indoor_image: mapStatus(statusData[0].merchant_shop_indoor_image_status),
        merchant_shop_outdoor_image: mapStatus(statusData[0].merchant_shop_outdoor_image_status),
        board_image: mapStatus(statusData[0].board_image_status),
        visiting_card_image: mapStatus(statusData[0].visiting_card_image_status),
      });


      const feedbackData = statusData[0].feedback[statusData[0].feedback.length - 1];
      console.log(statusData[0].feedback[statusData[0].feedback.length - 1])


      const {
        merchant_shop_indoor_image,
        merchant_shop_outdoor_image,
        board_image,
        visiting_card_image,
        map_location,
      } = feedbackData;

      // console.log(feedbackData)

      setMapFeedback(map_location)


      setFeedbacks({
        merchant_shop_indoor_image: merchant_shop_indoor_image,
        merchant_shop_outdoor_image: merchant_shop_outdoor_image,
        board_image: board_image,
        visiting_card_image: visiting_card_image,
      });

      // console.log(feedbackData); 
    } catch (error) {
      console.error("Error fetching image status:", error);
    }
  };


  const mapStatus = (status) => {
    switch (status) {
      case 1:
        return "Accepted";
      case 0:
        return "Rejected";
      case -1:
        return "Pending";
      default:
        return "Pending";
    }
  };

  const getImageStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-500";
      case "Rejected":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const anyRejected = Object.values(imageStatus).some(
    (status) => status === "Rejected"

  ) ;

  const allAccepted = Object.values(imageStatus).every(
    (status) => status === "Accepted"
  );


  useEffect(() => {
    showImageStatus(row.merchant_lead_id);
    setLastTime(row.status_time_stamp)
    console.log(row)
  }, [row.merchant_lead_id]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-3xl font-bold mb-2 text-center">Merchant Details</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-2">
        <p className="text-lg font-medium"><strong>Merchant Lead ID:</strong> {row.merchant_lead_id}</p>
        <p className="text-lg font-medium"><strong>Merchant Name:</strong> {row.merchant_name}</p>
        <p className="text-lg font-medium"><strong>TL ID:</strong> {row.tlid}</p>
        <p className="text-lg font-medium"><strong>TL Name:</strong> {row.tl_name}</p>
        <p className="text-lg font-medium"><strong>Sector ID:</strong> {row.sector_id}</p>

        {/* View on Google Map button
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowMapModal(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            View on Google Map
          </button>
        </div> */}

        {/* Map Modal */}
        {showMapModal && (
          <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
              {/* Title (optional) */}


              <LoadScript googleMapsApiKey="AIzaSyA300Ejm0hQEfbcokwbvlxEbE6Ock42iPM">
                {/* Flex container to display the maps side by side on larger screens */}
                <div className="flex flex-col lg:flex-row gap-6">

                  {/* First Google Map */}
                  <div className="w-full lg:w-1/2 h-96">
                    <h2 className="text-xl font-semibold mb-4 text-center">TL Location</h2>

                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={{ lat: latitude, lng: longitude }}
                      zoom={15}
                    >
                      <Marker position={{ lat: latitude, lng: longitude }} />
                    </GoogleMap>
                  </div>

                  {/* Second Google Map */}

                  <div className="w-full lg:w-1/2 h-96">
                    <h2 className="text-xl font-semibold mb-4 text-center">Merchant Location</h2>
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={{ lat: TLlatitude, lng: TLlongitude }}
                      zoom={15}
                    >
                      <Marker position={{ lat: TLlatitude, lng: TLlongitude }} />
                    </GoogleMap>
                  </div>

                </div>
              </LoadScript>



              <div className="mt-16 text-center">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                >
                  Close Map
                </button>

                {showMapRejectionDropdown && (
                  <div className="mt-4">
                    <select
                      value={mapRejectionReason}
                      onChange={handleMapRejectionReasonChange}
                      className="w-full p-2 border rounded-md bg-white-200"
                    >
                      <option value="">Select reason for rejection</option>
                      <option value="Wrong Location">Wrong Location</option>
                      <option value="Location not found">Location not found</option>
                      <option value="Location Not matched">Location Not matched</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={saveMapRejectionFeedback}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
                    >
                      Save Feedback
                    </button>
                  </div>
                )}

                {row.status === 'pending' && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        updateLocationStatus("location_status", "Accepted");
                        handleMapAccept();
                        saveMapAcceptedFeedback()
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => {
                        updateLocationStatus("location_status", "Rejected");
                        handleMapReject();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Rest of your component code... */}
        <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-3 border-b text-center">Image Name</th>
              <th className="px-4 py-3 border-b text-center">Status</th>
              <th className="px-4 py-3 border-b text-center">Action</th>

              {row.status !== 'Accepted' && (
                <th className="px-4 py-3 border-b text-center">Feedback</th>)
              }


            </tr>
          </thead>

          <tbody>
           

            {/* Existing image rows */}
            {["merchant_shop_indoor_image", "merchant_shop_outdoor_image", "board_image", "visiting_card_image"].map((imageKey) => (
              <tr key={imageKey}>
                <td className="px-4 py-3 border-b text-center">{imageKey.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 border-b text-center">
                  <span className={getImageStatusColor(imageStatus[imageKey])}>
                    {imageStatus[imageKey] || "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 border-b text-center">
                  <button
                    onClick={() => handleClick(imageKey, row.imageUrls[imageKey])}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    View
                  </button>
                </td>
                {row.status !== 'Accepted' && (

                  <td className="px-4 py-3 border-b text-center">
                    <span>{feedbacks[imageKey] || "No feedback"}</span>
                  </td>)

                }


              </tr>
            ))}
          </tbody>
        </table>

        {row.status !== 'pending' &&
          <h2 className="px-4 py-3 border-b text-center">{row.status} at {lastTime}</h2>}

        <div className="mt-6 flex space-x-4 justify-center">

          <button className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
            onClick={handleBack}>Back to Table</button>
          {anyRejected && row.status === 'pending' && (
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              onClick={() => {
                updateVerificationStatus("Rejected");
                setMerchantStatus("Rejected");
                SaveFeedback()

              }}
            >
              Reject Merchant
            </button>
          )}
          {allAccepted && row.status === 'pending' && (
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              onClick={() => {
                updateVerificationStatus("Accepted");
                setMerchantStatus("Accepted");
                SaveFeedback()
              }}
            >
              Accept Merchant
            </button>
          )}
        </div>
      </div>
      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <h2 className="text-xl font-semibold mb-4">Image Details</h2>

          {/* Zoomable Image */}
          <div
            
          >
            <img
              src={modalImage}
              alt="Modal"
              className="mb-4 relative"
              // className="relative"
            onWheel={handleWheel} // Handle mouse wheel zoom
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              overflow: 'hidden',
            
                transform: `scale(${zoom})`, // Apply zoom effect
                transition: 'transform 0.2s ease', // Smooth transition
                transformOrigin: 'center center', // Keep zoom centered
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setModalImage(null)}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300 absolute top-0 right-0 m-4"
          >
            X
          </button>

          {/* Rejection Dropdown and Reason */}
          {showRejectionDropdown && (
            <div className="mt-4 flex gap-5">
              <select
                value={rejectionReason}
                onChange={handleRejectionReasonChange}
                className="w-full p-2 border rounded-md bg-white-400"
              >
                <option value="">Select reason for rejection</option>
                <option value="Not a proper image">Not a proper image</option>
                <option value="Image not visible">Image not visible</option>
                <option value="Wrong image type">Wrong image type</option>
                <option value="Other">Other</option>
              </select>

              {showOtherReason && (
                <input
                  ref={inputRef}
                  type="text"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Enter the other reason"
                  className="p-2 border rounded-md"
                />
              )}

              <button
                onClick={saveRejectionFeedback}
                className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
              >
                Save
              </button>
            </div>
          )}

          {/* Accept/Reject buttons */}
          {row.status === 'pending' && (
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Reject
              </button>
              </div>
            )}


          </div>
        </div>
      )}
    </div>
  );
};


export default MerchantDetails;

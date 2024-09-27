/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Profile from "../components/driver/Profile";
import History from "../components/driver/History";
import UpdateProfile from "../components/driver/UpdateProfile";
import Spinner from "../components/Spinner";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const libraries = ["places"];

const DriverDashboard = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_googleMapAPI,
    libraries,
  });
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: 13.0843,
    lng: 80.2705,
    zoom: 12,
  });
  const rupeeSymbol = "\u20B9";
  const [rideStarted, setRideStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("available-request");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setDropdownOpen(false);
  };

  const [driverProfile, setDriverProfile] = useState(null);
  const [newRequests, setNewRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPaymentDone, setShowPaymentDone] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile-drive");
        setDriverProfile(response.data);
        console.log("user fetched success: ", response.data);
      } catch (error) {
        console.error("Error fetching driver profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Listen for new cab requests from passengers
  useEffect(() => {
    socket.on("new_request", async (request) => {
      console.log("Entered this new_request");
      setNewRequests((prev) => [...prev, request]);
      console.log("New Request data: ", request);
    });
    return () => socket.off("new_request");
  }, []);

  // Accept the ride and send to the passenger
  const acceptRequest = (request) => {
    if (request && driverProfile) {
      console.log("Accept Request data: ", request);
      setSelectedRequest(request);
      // Notify passenger of ride acceptance
      socket.emit("accept_request", {
        driverProfile,
        request,
        time: new Date().toUTCString(),
      });
      console.log("Data to passenger: ", { driverProfile, request });
    } else {
      navigate("/login-drive");
      console.error("Accept Request is missing or driver details are missing");
    }
  };
  // Reject the ride and remove from requests
  const rejectRequest = (request) => {
    if (request) {
      console.log("Rejecting Request: ", request);
      setNewRequests(newRequests.filter((req) => req !== request));
    }
  };

  const startRide = (request) => {
    if (request) {
      setRideStarted(true);
      setCenter({
        lat: request.directionsResponse.routes[0].legs[0].start_location.lat,
        lng: request.directionsResponse.routes[0].legs[0].start_location.lng,
        zoom: 18,
      });
    } else {
      console.error("Request is not given");
    }
  };

  const setEnd = async (request) => {
    setCenter({
      lat: 13.0843,
      lng: 80.2705,
      zoom: 18,
    });
    if (request) {
      // Reset after ride ends
      setNewRequests(newRequests.filter((req) => req !== request));
      setRideStarted(false);
      setSelectedRequest(null);
      socket.emit("end_ride");
    } else {
      console.error("Request is not given");
    }
  };

  useEffect(() => {
    socket.on("show_payment_done", () => {
      setShowPaymentDone(true);
      setShowConfirm(true);
    });
    return () => {
      socket.off("show_payment_done");
    };
  }, []);

  const okDone = () => {
    setShowConfirm(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "available-request":
        return (
          <>
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              center={center}
              zoom={center.zoom}
              onLoad={(map) => setMap(map)}
            >
              {/* Render the passenger's route */}
              {selectedRequest && (
                <DirectionsRenderer
                  directions={selectedRequest.directionsResponse}
                />
              )}
            </GoogleMap>
            <div className="absolute top-0 bg-white bg-opacity-85 p-4 rounded-lg shadow-lg w-96 z-10">
              <h2 className="text-xl font-semibold mb-4">New Requests</h2>
              {newRequests.length > 0 ? (
                newRequests.map((request, index) => (
                  <div
                    key={index}
                    className="request-item mb-4 p-2 border rounded-lg shadow-lg"
                  >
                    <p>
                      <span className="font-semibold">From:</span>
                      {" " + request.from.slice(0, 30) + "..."}
                    </p>
                    <p>
                      <span className="font-semibold">To:</span>
                      {" " + request.to.slice(0, 30) + "..."}
                    </p>
                    <p>
                      <span className="font-semibold">Fare:</span>
                      {" " + request.fare} {rupeeSymbol}
                    </p>

                    {!selectedRequest ? (
                      <div className="flex space-x-2">
                        <button
                          className="bg-green-500 text-white w-full py-2 mt-2 rounded-lg hover:bg-green-700"
                          onClick={() => acceptRequest(request)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white w-full py-2 mt-2 rounded-lg hover:bg-red-700"
                          onClick={() => rejectRequest(request)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <>
                        {newRequests.length > 0
                          ? newRequests.map((request, index) => (
                              <div
                                key={index}
                                className="driver-details mt-4 p-2 bg-gray-200 rounded"
                              >
                                <p>
                                  <span className="font-semibold">
                                    Passenger Name:
                                  </span>
                                  {" " + request.passengerName}
                                </p>
                                <div className="flex gap-6">
                                  <p>
                                    <span className="font-semibold">
                                      Passenger Phone:
                                    </span>
                                    {" " + request.passengerPhone}
                                  </p>
                                  <IoIosCall
                                    className="size-6 cursor-pointer text-green-600"
                                    onClick={() =>
                                      alert(
                                        `Calling ${request.passengerPhone}...`
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ))
                          : null}

                        <button
                          className={`bg-blue-500 text-white w-full py-2 mt-2 rounded-lg ${
                            rideStarted
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                          onClick={() => startRide(request)}
                          disabled={rideStarted}
                        >
                          Start
                        </button>
                        <button
                          className="bg-red-500 text-white w-full py-2 mt-2 rounded-lg hover:bg-red-700"
                          onClick={() => setEnd(request)}
                        >
                          End
                        </button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center font-semibold">
                  No new requests at the moment.
                </p>
              )}
            </div>
            {showPaymentDone && showConfirm && (
              <div className="absolute border bottom-1/2 left-1/4 right-1/4 bg-gray-950 text-white p-4 rounded-lg shadow-lg z-20 flex flex-col gap-4">
                <h1 className="text-3xl text-white text-center">
                  Payment received
                </h1>
                <button
                  className="bg-blue-500 text-white w-full py-2 mt-2 rounded-lg hover:bg-blue-700"
                  onClick={okDone}
                >
                  Okay
                </button>
              </div>
            )}
          </>
        );
      case "driver-info":
        return <Profile />;
      case "history":
        return <History />;
      case "update-profile":
        return <UpdateProfile />;
      default:
        return null;
    }
  };

  if (!isLoaded) return <Spinner loading={true} />;
  return (
    <div className="h-screen">
      <nav className="bg-gray-950 text-white h-16 flex items-center justify-between px-4 relative z-20">
        <div className="text-xl hover:text-yellow-400 hover:cursor-pointer">
          Express Cabs
        </div>
        <div className="relative">
          <FaBars
            className="text-2xl cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-950 rounded-lg shadow-lg z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer z-20"
                  onClick={() => handleTabClick("available-request")}
                >
                  New Requests
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTabClick("driver-info")}
                >
                  Driver Info
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer z-20"
                  onClick={() => handleTabClick("history")}
                >
                  History
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleTabClick("update-profile")}
                >
                  Update Profile
                </li>
                <Link to="/">
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Logout
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div className="relative h-[calc(100vh-4rem)]">{renderTabContent()}</div>
    </div>
  );
};

export default DriverDashboard;
